var Mandelbrot = {
     MinRe: -2.0,
     MaxRe: 1.0,
     MinIm: -1.2,
};

Mandelbrot.doMandelbrot = function(binaryData, iterations, workerHeight, workerWidth, startY, imageHeight)
{
    Mandelbrot.MaxIm = Mandelbrot.MinIm+(Mandelbrot.MaxRe-Mandelbrot.MinRe)*(imageHeight/workerWidth);
    var Re_factor = (Mandelbrot.MaxRe-Mandelbrot.MinRe)/(workerWidth-1);
    var Im_factor = (Mandelbrot.MaxIm-Mandelbrot.MinIm)/(imageHeight-1);

    for(var y = 0; y < workerHeight; y++)
    {
        var c_im = Mandelbrot.MaxIm - (y+startY)*Im_factor;
        for(var x = 0; x < workerWidth; ++x)
        {
            var c_re = Mandelbrot.MinRe + x*Re_factor;

            var Z_re = c_re, Z_im = c_im;
            var isInside = true;
            for(var n=0; n<iterations; ++n)
            {
                var Z_re2 = Z_re*Z_re, Z_im2 = Z_im*Z_im;
                if(Z_re2 + Z_im2 > 4)
                {
                    isInside = false;
                    break;
                }
                Z_im = 2*Z_re*Z_im + c_im;
                Z_re = Z_re2 - Z_im2 + c_re;
            }

            if(isInside)
                 Mandelbrot.drawPixel(x, y, 0, 0, 0, 255, binaryData, workerWidth);
            else
            {
                var pixelColor = 3*Math.log(n)/Math.log(iterations - 1.0);
                if (pixelColor < 1)
                    Mandelbrot.drawPixel(x, y, 255*pixelColor, 0, 0, 255, binaryData, workerWidth);
                else if (pixelColor < 2)
                    Mandelbrot.drawPixel(x, y, 255, 255*(pixelColor-1), 0, 255, binaryData, workerWidth);
                else
                    Mandelbrot.drawPixel(x, y, 255, 255, 255*(pixelColor-2), 255, binaryData, workerWidth);
            }
        }
    }
};

Mandelbrot.drawPixel = function(x, y, r, g, b, a, binaryData, imageWidth) {
    var index = (x + y * imageWidth) * 4;
    binaryData[index + 0] = r;
    binaryData[index + 1] = g;
    binaryData[index + 2] = b;
    binaryData[index + 3] = a;
};