import { app, HttpRequest, HttpResponse, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as util from "util";
import * as QRCode from "qrcode";
import * as q from "q";
import * as fs from "fs";

export async function generateQRCode(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    console.log("Current directory:", __dirname);
    console.log("context", context);
    console.log("request", request);
    context.log(`Http function processed request for url "${request.url}"`);
    const currentURL = request.query.get("url");
    return new HttpResponse({ body: "Test" });;
    if (!currentURL) {
        throw Error("Invalid URL");
    }

    const encodedURL = encodeURIComponent(currentURL);
    // QRCode.toDataURL(currentURL, function (err, url) {
    //   console.log("qr url:", url);
    //   return { body: `${url}!` };
    // });

    const imageType = request.query.get("imageType") || "svg";
    console.log("currentURL:", currentURL);
    console.log("encodedURL:", encodedURL);
    console.log("imageType:", imageType);

    const QRCode_toFileWrapper_Promisifed = util.promisify(
        (path, text, options, callback) =>
            QRCode.toFile(path, text, options, callback)
    );

    // const toFile = util.promisify(QRCode.toFile);
    await QRCode_toFileWrapper_Promisifed(
        `imgs/${encodedURL}.${imageType}`,
        currentURL,
        // {
        //   type: `${imageType}`,
        // },
        (err) => {
            console.log("callback");
            console.log("file err:", err);
        }
    );
    console.log("file saved");

    // await fs.readFile("imgs/9712A018601.svg", "utf8", function (err, data) {
    //   if (err) throw err;
    //   fileContent = data;
    //   const response = new HttpResponse({ body: fileContent });
    //   response.headers.set(
    //     "Content-Disposition",
    //     `attachment; filename=9712A018601.svg`
    //   );
    //   return response;
    // });
    const fileName = `${encodedURL}.${imageType}`;
    const filePath = `imgs/${fileName}`;
    const rawFile = await q.nfcall(fs.readFile, filePath);
    const fileBuffer = Buffer.from(rawFile, "base64");
    // context.res = {
    //     status: 202,
    //     body: fileBuffer,
    //     headers: {
    //         "Content-Disposition": "inline",
    //     },
    // };

    const response = new HttpResponse({ body: fileBuffer });
    response.headers.set(
        "Content-Disposition",
        `attachment; filename="${currentURL}"`
    );
    return response;

    // return {
    //   body: await QRCode.toDataURL("https://www.rxsavingsplus.com/9712A018601"),
    // };
    // return { body: `${url}!` };

    // QRCode.toFile(
    //   "imgs/9712A018601.svg",
    //   "https://www.rxsavingsplus.com/9712A018601",
    //   {
    //     type: "svg",
    //   },
    //   (err) => {
    //     console.log("file err:", err);
    //     // console.log("qr url:", url);
    //     fs.readFile("imgs/9712A018601.svg", "utf8", function (err, data) {
    //       if (err) throw err;
    //       fileContent = data;
    //       context.res = {
    //         status: 202,
    //         body: fileContent,
    //         headers: {
    //           "Content-Disposition": `attachment; filename=9712A018601.svg`,
    //           "Content-Type": downloadBlockBlobResponse.contentType,
    //         },
    //       };
    //       // return;

    //       // context.done();
    //     });
    //     // return { body: `${url}!` };
    //   }
    // );
};

app.http('generateQRCode', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: generateQRCode
});
