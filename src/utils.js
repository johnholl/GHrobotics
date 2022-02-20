import {matrix, inv, pow, multiply} from 'mathjs';


export function spline(t0, t1, x0, x1, y0, y1, xp0, xp1, yp0, yp1) {


    const m = matrix([[pow(t0,3), pow(t0,2), t0, 1],
                      [pow(t1,3), pow(t1,2), t1, 1],
                      [multiply(pow(t0,2),3), multiply(t0,2), 1, 0],
                      [multiply(pow(t1,2),3), multiply(t1,2), 1, 0]])
    const minv = inv(m);

    const xcoeff = multiply(minv, [x0,x1,xp0,xp1])
    const ycoeff = multiply(minv, [y0,y1,yp0,yp1])

    return {xcoeff, ycoeff};


}

export function generatePoints(t0, t1, dt, xcoeff, ycoeff) {

    var t = t0;
    var xpoints = [];
    var ypoints = [];
    while(t < t1 + multiply(dt, 0.1)){
        var xval = multiply(xcoeff.get([0]),pow(t,3))+multiply(xcoeff.get([1]),pow(t,2))+multiply(xcoeff.get([2]),t)+xcoeff.get([3]);
        var yval = multiply(ycoeff.get([0]),pow(t,3))+multiply(ycoeff.get([1]),pow(t,2))+multiply(ycoeff.get([2]),t)+ycoeff.get([3]);
        xpoints.push(xval);
        ypoints.push(yval);
        t = t + dt;
    }

    return {xpoints, ypoints};

}

// precondition x, y, xp, yp, t, dt are all arrays of the same length
export function generatePath(x, y, xp, yp, t, dt) {

    var xpath = [];
    var ypath = [];

    for(var i =0; i<x.length-1; i++){
        const {xcoeff, ycoeff} = spline(t[i], t[i+1], x[i], x[i+1], y[i], y[i+1], xp[i], xp[i+1], yp[i], yp[i+1])
        const {xpoints, ypoints} = generatePoints(t[i], t[i+1], dt[i], xcoeff, ycoeff);
        xpath = xpath.concat(xpoints);
        ypath = ypath.concat(ypoints);
    }

    return {xpath, ypath}

}


export function calculateOffsetPaths(x, y, d){
    var xLpath = [];
    var yLpath = [];
    var xRpath = [];
    var yRpath = [];

    for(var i=0; i<x.length-1; i++){
        var xdiff = x[i+1] - x[i];
        var ydiff = y[i+1] - y[i];
        var r = pow(pow(xdiff, 2) + pow(ydiff, 2), 0.5)
        var newxL = x[i] + ydiff*d/r;
        var newyL = y[i] - xdiff*d/r;
        xLpath.push(newxL);
        yLpath.push(newyL);

        var newxR = x[i] - ydiff*d/r;
        var newyR = y[i] + xdiff*d/r;
        xRpath.push(newxR);
        yRpath.push(newyR);

    }

    return {xLpath, yLpath, xRpath, yRpath};
}


export function xyrange(xstart, xend, ystart, yend, inc) {
    var xres = [];
    var yres = []
    var y = ystart;
    while(y < yend){
        var x = xstart
        while(x < xend){
            xres.push(x);
            yres.push(y);
            x += inc;
        }
        y += inc;
    }
    return [xres, yres];
}