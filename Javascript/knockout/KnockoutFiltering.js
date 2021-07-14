
function TestVM(){
      var _testVM = this;
      this.SelectedCategory = ko.observable("ALL");
      this.List = ko.observableArray([]);
  
      this.CategoryFilteredList = ko.computed(function () {
        //filtering htrough category
        var filteredList = ko.utils.arrayFilter(_testVM.List(), function (item) {
            return item.Category() == _testVM.SelectedCategory();
        });

        //filtering the distinct records
        var seen = [];
        var distintList = filteredList.filter(function (n) {
            return seen.indexOf(n.TaskID()) == -1 && seen.push(n.TaskID());
        });

        //sorting by date
        return distintList.sort(function (left, right) {
            return left.CreatedDate() == right.CreatedDate() ?
                0 :
                (left.CreatedDate() > right.CreatedDate() ? -1 : 1);
        });
    });
}

var testVM = new TestVM();
ko.applyBindings(testVM);
