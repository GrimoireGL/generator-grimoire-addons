// Converters should have the name that is end with 'Converter'
// Build environment would generate 'registerConverter' statements for converters contained in this project.
//
// Tips to make converters
// 'converter' is just a function that would recieve a value of unknown type and return specific type.
// For example, if this was Vector3 converter.
// Converted object should be a Vector3 instance, but the argument type is unknown.
// That can be string,function or just a Vector3 instance.
//
// Whatever kind of argument type was passed, what all converter needs to do is just convert them into ideal type.(in the example above,the ideal type must be Vector3).
// If the converter encounted an argument of invalid type which is not able to convert, just throw Exception.

function SampleConverter(argument: any): any {
  if (typeof argument === "string") {
   return argument.toUpperCase(); // Perform something to change type
  }
  throw new Error("Type sample could not accept non-string type");
}

export default SampleConverter;
