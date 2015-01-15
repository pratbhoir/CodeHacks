    <script>

        function loadAjax() {
            var dataToSend = '{"name":"Pratik"}';
            //console.log(JSON.parse(dataToSend));
            $.ajax({
                url: 'http://dprofiles.com/sandbox/test.php',
                type: 'post',
                //contentType:'text/html',
                data: JSON.parse(dataToSend),//{name:"Pratik"},//
                //dataType  : 'JSON',
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

    </script>


//PHP Code

<?php header('Access-Control-Allow-Origin: *'); ?>
<?php
  // get the q parameter from URL
  $q = $_POST['name'];		//For POST
  //$q = $_REQUEST['name']; 	// FOR GET
  //$q="Pratik";
  $temp = $q;
  $temp = "Hello ". $temp . ", How are you?";
  echo $temp;
?>
