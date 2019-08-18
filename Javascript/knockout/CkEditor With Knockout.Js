<!DOCTYPE html>
<html>
<head>
    <script src="https://code.jquery.com/jquery-1.9.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min.js"></script>
    <script src="//cdn.ckeditor.com/4.4.7/standard/ckeditor.js"></script>
    <script src="http://nightly.ckeditor.com/15-05-26-06-08/standard/adapters/jquery.js"></script>
    <meta charset="utf-8">
    <title>CkEditor With Knockout.Js</title>
</head>
<body>
    <a href="http://jsbin.com/rolihuwidu/2/edit">Link to demo</a>
    <h2 data-bind="text:Title"></h2>

    <textarea id="editor" data-bind="ckeditor:HtmlContent, valueUpdate: 'afterkeydown'"></textarea>
    <br>
    <hr>

    <h2>Html View</h2>

    <div data-bind="html:HtmlContent"></div>

    <script>
        function ViewModel() {
            this.Title = "CkEditor With Knockout.Js";
            this.HtmlContent = ko.observable("aaaaaaa");
        }

        //function ckUpdate()
        //{
        //  for (var i in CKEDITOR.instances) {
        //    CKEDITOR.instances[i].updateElement();
        //   //CKEDITOR.instances[i].on('change', function() {CKEDITOR.instances[i].updateElement()});
        //    }
        //}

        var viewModel = new ViewModel();

        $(function () {
            ko.applyBindings(viewModel);
        });

        ko.bindingHandlers.ckeditor = {
            init: function (element, valueAccessor, allBindingsAccessor, context) {
                console.log("init");
                var options = allBindingsAccessor().ckeditorOptions || {};
                var modelValue = valueAccessor();
                var value = ko.utils.unwrapObservable(valueAccessor());

                $(element).html(value);
                $(element).ckeditor();

                var editor = $(element).ckeditorGet();

                //handle edits made in the editor
                editor.on('change', function (e) {
                    var self = this;
                    if (ko.isWriteableObservable(self)) {
                        self($(e.listenerData).val());
                    }
                }, modelValue, element);

                //handle disposal (if KO removes by the template binding)
                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    if (editor) {
                        CKEDITOR.remove(editor);
                    };
                });
            },
            update: function (element, valueAccessor, allBindingsAccessor, context) {
                // handle programmatic updates to the observable
                var newValue = ko.utils.unwrapObservable(valueAccessor());

                if ($(element).ckeditorGet().getData() != newValue) {
                    $(element).ckeditorGet().setData(newValue)
                }
            }
        };
    </script>

</body>
</html>
