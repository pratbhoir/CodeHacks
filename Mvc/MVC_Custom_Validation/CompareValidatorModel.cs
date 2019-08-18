using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Mvc5Demo.CustomValidations;
using System.ComponentModel.DataAnnotations;

namespace Mvc5Demo.Models
{
    public class CompareValidatorModel 
    {
        [Required]
        [DisplayFormat(DataFormatString = "{0:dd/MM/yyyy}", ApplyFormatInEditMode = true)]
        public DateTime FromDate { get; set; }

        [Required]
        [DisplayFormat(DataFormatString = "{0:dd/MM/yyyy}", ApplyFormatInEditMode = true)]
        [ToDateValidator(GenericCompareOperator.GreaterThan,"FromDate",ErrorMessage="The Date must be greater than fromDate")]
        public DateTime TODate { get; set; }

    }
}
