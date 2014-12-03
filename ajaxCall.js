
    function ajaxCall() {
        var dataToSend = '{"AcademicId":"13","SchoolBranchId":"1","FeesTypeId":"1"}';

        $.ajax({
            url: '@Url.Action("GetAvailableStandards")',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: dataToSend,
            success: function (response) {
                console.log(response);
                if (response != null) {

                }
            },
            error: function (xhr) {
                alert('Error: There was some error while posting question. Please try again later.');
            }
        });
    }
