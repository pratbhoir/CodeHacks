   //PDF GENERATIOn CLASS
    public class QRCodeGenerator
    {

        public class QRCodeItem
        {
            public string QRCode { get; set; }
            public string QRDisplay { get; set; }
        }

        public Bitmap GenerateQRCodeSquare(string QRCode, string DisplayCode)
        {
            int _Height = 200;
            int _Width = 200;

            var encOptions = new ZXing.Common.EncodingOptions
            {
                Width = _Width,
                Height = _Height,
                Margin = 1,
                PureBarcode = false
            };

            IBarcodeWriter writer = new BarcodeWriter { Format = BarcodeFormat.QR_CODE, Options = encOptions };
            var result = writer.Write(QRCode);
            var barcodeBitmap = new Bitmap(result);

            Bitmap bmp = barcodeBitmap; //from ZXing;

            RectangleF rectf = new RectangleF(0, _Height - 20, _Width - 10, 10);

            Graphics g = Graphics.FromImage(bmp);

            g.SmoothingMode = SmoothingMode.AntiAlias;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.DrawString(DisplayCode, new Font("Tahoma", 7), Brushes.Black, rectf);

            g.Flush();

            return bmp;
        }

        public Bitmap GenerateQRCodeRectangle(string QRCode, string DisplayCode)
        {
            int _Height = 150;
            int _Width = 150;

            var encOptions = new ZXing.Common.EncodingOptions
            {
                Width = _Width,
                Height = _Height,
                Margin = 1,
                PureBarcode = false
            };

            IBarcodeWriter writer = new BarcodeWriter { Format = BarcodeFormat.QR_CODE, Options = encOptions };
            var result = writer.Write(QRCode);
            var barcodeBitmap = new Bitmap(result);

            //Bitmap bmp = new Bitmap((Image)barcodeBitmap, new Size(barcodeBitmap.Height, 400)); //from ZXing;

            Bitmap bmp = _FixedSize(barcodeBitmap, 300, _Height);

            //bmp. = new Size(bmp.Height, 60); 

            RectangleF rectf = new RectangleF(_Width + 5, (_Height / 2) - 10, _Width - 5, 30);

            Graphics g = Graphics.FromImage(bmp);

            g.SmoothingMode = SmoothingMode.AntiAlias;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.DrawString(DisplayCode, new Font("Tahoma", 18, FontStyle.Bold), Brushes.Black, rectf);

            g.Flush();

            return bmp;
        }

        public PdfDocument GetQRCodePdf(List<QRCodeItem> QRCodeList)
        {
            //throwing Exception IF there is no QR COde
            if (QRCodeList == null || QRCodeList.Count == 0)
            {
                throw new Exception("QR Code is not passed to QR Code Geneartor");
            }

            PdfDocument _document = new PdfDocument();
            _document.Info.Title = "Serial QR Code";
            _document.Info.Author = "P2P";
            _document.Info.Subject = "P2P - Serial QR Code";

            //Parsing through list of QR COdes
            foreach (var _QrCodeItem in QRCodeList)
            {
                //Generating QR Code Image
                var bitmapImg = GenerateQRCodeRectangle(_QrCodeItem.QRCode, _QrCodeItem.QRDisplay);
                //Converting to PDF COmpaitable Image format
                XImage xImage = XImage.FromGdiPlusImage(bitmapImg);
                int xPosition = 15;
                int yPosition = 0;

                // Create new page
                //Setting Page size, size of Image
                PdfPage page = _document.AddPage();
                page.Width = xImage.PixelWidth + 10; //+10;
                page.Height = xImage.PixelHeight + 0;// +20;

                //XFont font = new XFont("Verdana", 20, XFontStyle.Bold);
                //gfx.DrawString("Hello, World!", font, XBrushes.Black,
                //new XRect(0, 0, page.Width, page.Height),
                //XStringFormat.Center);

                // Create graphics object and draw clock
                XGraphics gfx = XGraphics.FromPdfPage(page);
                //Rendering Image to PDF
                gfx.DrawImage(xImage, xPosition, yPosition, xImage.PixelWidth, xImage.PixelHeight);
            }
            return _document;
        }

        #region Private Properties

        private Bitmap _FixedSize(Bitmap imgPhoto, int Width, int Height)
        {
            int sourceWidth = imgPhoto.Width;
            int sourceHeight = imgPhoto.Height;
            int sourceX = 0;
            int sourceY = 0;
            int destX = 0;
            int destY = 0;

            float nPercent = 0;
            float nPercentW = 0;
            float nPercentH = 0;

            nPercentW = ((float)Width / (float)sourceWidth);
            nPercentH = ((float)Height / (float)sourceHeight);
            if (nPercentH < nPercentW)
            {
                nPercent = nPercentH;
                destX = System.Convert.ToInt16((Width - (sourceWidth * nPercent)) / 2);
            }
            else
            {
                nPercent = nPercentW;
                destY = System.Convert.ToInt16((Height - (sourceHeight * nPercent)) / 2);
            }

            int destWidth = (int)(sourceWidth * nPercent);
            int destHeight = (int)(sourceHeight * nPercent);

            Bitmap bmPhoto = new Bitmap(Width, Height,
                              PixelFormat.Format24bppRgb);
            bmPhoto.SetResolution(imgPhoto.HorizontalResolution,
                             imgPhoto.VerticalResolution);

            Graphics grPhoto = Graphics.FromImage(bmPhoto);
            grPhoto.Clear(Color.White);
            grPhoto.InterpolationMode =
                    InterpolationMode.HighQualityBicubic;

            grPhoto.DrawImage(imgPhoto,
                new Rectangle(0, destY, destWidth, destHeight),
                new Rectangle(sourceX, sourceY, sourceWidth, sourceHeight),
                GraphicsUnit.Pixel);

            grPhoto.Dispose();
            return bmPhoto;
        }

        #endregion

    }
