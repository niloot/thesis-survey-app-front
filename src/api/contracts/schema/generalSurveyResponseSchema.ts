import NumberIdentifiedEntitySchema from "./numberIdentifiedEntitySchema";

export default interface GeneralSurveyResponseSchema
  extends NumberIdentifiedEntitySchema {
  age: number;
  sex: string;
}
