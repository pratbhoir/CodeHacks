using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Mvc5Demo.CustomValidations
{

    public enum GenericCompareOperator
    {
        GreaterThan,
        GreaterThanOrEqual,
        LessThan,
        LessThanOrEqual
    }

    public class ToDateValidatorAttribute : ValidationAttribute, IClientValidatable
    {
        public ToDateValidatorAttribute(GenericCompareOperator compareOperator, string otherPropertyId)
        {
            this.OtherPropertyId = otherPropertyId;
            this.CompareOperator = compareOperator;
        }

        public string OtherPropertyId { get; private set; }
        public GenericCompareOperator CompareOperator { get; private set; }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var otherProperty = validationContext.ObjectInstance.GetType().GetProperty(OtherPropertyId);
            var otherValue = otherProperty.GetValue(validationContext.ObjectInstance, null);

            DateTime fromDate = Convert.ToDateTime(otherValue);
            DateTime toDate = Convert.ToDateTime(value);

            switch (CompareOperator)
            {
                case GenericCompareOperator.GreaterThan:
                    if (toDate > fromDate)
                    {
                        return null;
                    }
                    break;
                case GenericCompareOperator.GreaterThanOrEqual:
                    if (toDate >= fromDate)
                    {
                        return null;
                    }
                    break;
                case GenericCompareOperator.LessThan:
                    if (toDate < fromDate)
                    {
                        return null;
                    }
                    break;
                case GenericCompareOperator.LessThanOrEqual:
                    if (toDate <= fromDate)
                    {
                        return null;
                    }
                    break;
                default:
                    break;
            }
            //if error
            return new ValidationResult(this.FormatErrorMessage(validationContext.DisplayName));

        }

        //For Client Side Validation
        public IEnumerable<ModelClientValidationRule> GetClientValidationRules(ModelMetadata metadata, ControllerContext context)
        {
            var modelClientValidationRule = new ModelClientValidationRule
            {
                ValidationType = "todatevalidator",
                ErrorMessage = FormatErrorMessage(metadata.DisplayName)
            };
            modelClientValidationRule.ValidationParameters.Add("fromdate", OtherPropertyId);
            modelClientValidationRule.ValidationParameters.Add("compareoperator", CompareOperator.ToString());
            yield return modelClientValidationRule;
        }


    }

    //public class CombinedMinLengthAttribute : ValidationAttribute
    //{
    //    public CombinedMinLengthAttribute(int minLength, params string[] propertyNames)
    //    {
    //        this.PropertyNames = propertyNames;
    //        this.MinLength = minLength;
    //    }

    //    public string[] PropertyNames { get; private set; }
    //    public int MinLength { get; private set; }

    //    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    //    {
    //        var properties = this.PropertyNames.Select(validationContext.ObjectType.GetProperty);
    //        var values = properties.Select(p => p.GetValue(validationContext.ObjectInstance, null)).OfType<string>();
    //        var totalLength = values.Sum(x => x.Length) + Convert.ToString(value).Length;
    //        if (totalLength < this.MinLength)
    //        {
    //            return new ValidationResult(this.FormatErrorMessage(validationContext.DisplayName));
    //        }
    //        return null;
    //    }
    //}

    ////Using this Attribute
    ////public class MyViewModel
    ////{
    ////    [CombinedMinLength(20, "Bar", "Baz", ErrorMessage = "The combined minimum length of the Foo, Bar and Baz properties should be longer than 20")]
    ////    public string Foo { get; set; }
    ////    public string Bar { get; set; }
    ////    public string Baz { get; set; }
    ////}


}
