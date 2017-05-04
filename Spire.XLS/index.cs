
Link: http://www.c-sharpcorner.com/blogs/protecting-excel-files-programmatically

    Workbook workbook = new Workbook();
    workbook.LoadFromFile(objUpload.FilePath);
    //protect specified worksheet  
    //workbook.Worksheets["COI as per Tax team"].Unprotect(strPassword);

    Worksheet sheet = workbook.Worksheets["COI as per Tax team"];
    sheet.Unprotect(strPassword);
    sheet.Range["C1"].Text = "'";

    if (objUpload.FilePath.Contains(".xlsx"))
    {
        workbook.SaveToFile(objUpload.FilePath, ExcelVersion.Version2007);
    }
    else
    {
        workbook.SaveToFile(objUpload.FilePath, ExcelVersion.Version97to2003);
    }
    
    
    
    
//Lock certain cells in Excel Worksheet.
    //create an Excel instance and load the document from file   
    Workbookworkbook = newWorkbook();  
    workbook.LoadFromFile("sample.xlsx");  
    Worksheet sheet = workbook.Worksheets[0];  
    //lock certain cells  
    workbook.Worksheets[0].Range["A1A15"].Style.Locked = true;  
    //unlock certain cells  
    workbook.Worksheets[0].Range["B1"].Style.Locked = false;  
    sheet.Protect("123", SheetProtectionType.All);  
    workbook.SaveToFile("ProtectedExcelCells.xlsx", ExcelVersion.Version2010);
