import Component from "grimoirejs/lib/Core/Node/Component";
class SampleComponent extends Component {
  public static attributes = {
    test: {
      converter: "string",
      default: "HELLO"
    }
  };
}

export default SampleComponent;
