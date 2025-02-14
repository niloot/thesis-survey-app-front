import { SurveyResponseDto } from "@/api/contracts";
import { IDto, ITwoWayMapper, Model } from "@/core";
import { ThesisSurvey } from "@/models";
import GeneralSurveyMapper from "./GeneralSurveyMapper";
import OverconfidenceMapper from "./OverconfidenceMapper";
import TeamCoordinationMapper from "./TeamCoordinationMapper";
import VoiceSurveyMapper from "./VoiceSurveyMapper";

export default class SurveyResponseMapper implements ITwoWayMapper {
  createModelFromDto(_dto: IDto): Model {
    throw new Error("Method not implemented.");
  }

  createDtoFromModel(model: ThesisSurvey): SurveyResponseDto {
    const _overconfidenceMapper = new OverconfidenceMapper();
    const _generalSurveyMapper = new GeneralSurveyMapper();
    const _teamCoordinationMapper = new TeamCoordinationMapper();
    const _voiceSurveyMapper = new VoiceSurveyMapper();
    return {
      general_survey_response: _generalSurveyMapper.createDtoFromModel(
        model.generalSurvey
      ),
      overconfidence_survey_response: _overconfidenceMapper.createDtoFromModel(
        model.overconfidenceSurvey
      ),
      team_coordination_survey_response: _teamCoordinationMapper.createDtoFromModel(
        model.teamCoordinationSurvey
      ),
      voice_survey_responses: model.voiceSurveys.map((survey) =>
        _voiceSurveyMapper.createDtoFromModel(survey)
      ),
    };
  }
}
