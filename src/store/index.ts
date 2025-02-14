import arrayShuffle from "array-shuffle";
import {
  getStats,
  getTeamInfo,
  submitOrganizationInfo,
  submitParticipantResponse,
} from "@/api/services";
import { createStore } from "vuex";
import {
  OrganizationRegistrationMapper,
  SurveyResponseMapper,
  TeamWithOrganizationInfoMapper,
} from "@/mappers";
import {
  GeneralSurvey,
  OrganizationInfo,
  SurveySummary,
  Team,
  TeamMember,
  TeamWithOrganizationInfo,
  VoiceSurvey,
} from "@/models";

import { state, State } from "./state";
import { OrganizationGeneralInfo } from "@/models/OrganizationInfo";
import { LikertResponse, MinMaxResponse } from "@/models/common";
import { SITE_TITLE, MINIMUM_TEAM_SIZE, MAXIMUM_TEAM_SIZE } from "@/constants";
import Stats from "@/models/Stats";
import StatsMapper from "@/mappers/StatsMapper";

type SimpleProcedure = () => void;

const store = createStore({
  state: state,
  getters: {
    surveySummary: (state) => {
      return new SurveySummary(
        state.activeParticipant,
        state.teamInfo,
        state.survey
      );
      // TODO: depend only on Survey
    },
    stats: (state) => {
      return state.stats;
    },
    teamSize: (state) => {
      return state.teamInfo.members.length;
    },
    NotYetRespondedTeamMembers: (state) => {
      return state.teamInfo.members.filter(
        (member) => member.hasParticipated === false
      );
    },
    surveyTitle: (state) => {
      return SITE_TITLE;
    },
  },
  actions: {
    fetchTeamInfo({ commit, getters }, teamId: string) {
      commit("setLoading", true);
      getTeamInfo(teamId)
        .then((res) => {
          const dto = res.data;
          const mapper = new TeamWithOrganizationInfoMapper();
          const teamInfo = mapper.createModelFromDto(dto);
          commit("setTeamInfo", teamInfo);
          // const remainingParticipants = getters.NotYetRespondedTeamMembers;
          // if (remainingParticipants.length <= 0) {

          // }
          commit("generateVoiceResponseItemForEachTeamMember");
        })
        .catch((err) => console.log(err))
        .finally(() => {
          commit("setLoading", false);
        });
    },
    registerOrganization({ commit, state }, onSuccess: SimpleProcedure) {
      const mapper = new OrganizationRegistrationMapper();
      const organizationInfoDto = mapper.createDtoFromModel(
        state.registrationInfo
      );
      commit("setLoading", true);
      submitOrganizationInfo(organizationInfoDto)
        .then((res) => {
          const createdOrganization = res.data;
          const updatedRegistrationInfo = mapper.createModelFromDto(
            createdOrganization
          );
          commit("replaceWithCreatedOrganization", updatedRegistrationInfo);
          onSuccess();
        })
        .catch((err) => {
          console.error(err);
          // onError();
        })
        .finally(() => {
          commit("setLoading", false);
        });
    },
    submitResponse(
      { commit, state },
      {
        onSuccess,
        onFailure,
      }: { onSuccess: SimpleProcedure; onFailure: SimpleProcedure }
    ) {
      const participantId = (state.activeParticipant.id as string) || undefined;
      if (!participantId) {
        return Promise.reject("No active participant is set!");
      }
      const mapper = new SurveyResponseMapper();
      const dto = mapper.createDtoFromModel(state.survey);
      commit("setLoading", true);
      submitParticipantResponse(participantId, dto)
        .then(() => onSuccess())
        .catch((err) => onFailure())
        .finally(() => {
          commit("setLoading", false);
        });
    },
    fetchStats({ commit }) {
      getStats().then((res) => {
        const dto = res.data;
        const mapper = new StatsMapper();
        const model = mapper.createModelFromDto(dto);
        commit("setStats", model);
      });
    },
  },
  mutations: {
    // survey mutations:
    setTeamInfo(state: State, teamInfoObject: TeamWithOrganizationInfo) {
      // TODO should not use Dto directly
      state.teamInfo = teamInfoObject;
    },
    setActiveParticipant(state: State, participant: TeamMember) {
      state.activeParticipant = participant;
    },
    setGeneralSurveyResponse(
      state: State,
      generalSurveyResponse: GeneralSurvey
    ) {
      state.survey.generalSurvey = generalSurveyResponse;
    },
    setOverconfidenceSurveyQuestionResponse(
      state: State,
      payload: { index: number; response: MinMaxResponse }
    ) {
      const { index, response } = payload;
      switch (index) {
        case 1:
          state.survey.overconfidenceSurvey.q01.response = response;
          break;
        case 2:
          state.survey.overconfidenceSurvey.q02.response = response;
          break;
        case 3:
          state.survey.overconfidenceSurvey.q03.response = response;
          break;
        case 4:
          state.survey.overconfidenceSurvey.q04.response = response;
          break;
        case 5:
          state.survey.overconfidenceSurvey.q05.response = response;
          break;
        case 6:
          state.survey.overconfidenceSurvey.q06.response = response;
          break;
        case 7:
          state.survey.overconfidenceSurvey.q07.response = response;
          break;
        case 8:
          state.survey.overconfidenceSurvey.q08.response = response;
          break;
        case 9:
          state.survey.overconfidenceSurvey.q09.response = response;
          break;
        case 10:
          state.survey.overconfidenceSurvey.q10.response = response;
      }
    },
    setTeamCoordinationSurveyResponse(
      state: State,
      payload: { index: number; response: LikertResponse }
    ) {
      const { index, response } = payload;
      switch (index) {
        case 1:
          state.survey.teamCoordinationSurvey.q1.response = response;
          break;
        case 2:
          state.survey.teamCoordinationSurvey.q2.response = response;
          break;
        case 3:
          state.survey.teamCoordinationSurvey.q3.response = response;
          break;
        case 4:
          state.survey.teamCoordinationSurvey.q4.response = response;
          break;
        case 5:
          state.survey.teamCoordinationSurvey.q5.response = response;
          break;
      }
    },
    generateVoiceResponseItemForEachTeamMember(state: State) {
      const shuffledMembers = arrayShuffle(state.teamInfo.members);
      shuffledMembers.forEach((member) => {
        state.survey.voiceSurveys.push(new VoiceSurvey(member));
      });
    },
    setVoiceSurveyResponse(state: State, updatedSurvey: VoiceSurvey) {
      let surveyState = state.survey.voiceSurveys.find(
        (survey) => survey.id === updatedSurvey.id
      );
      if (surveyState) {
        surveyState = updatedSurvey;
      } else {
        console.error(`Could not find survey with id ${updatedSurvey.id}`);
      }
    },

    // end of survey mutations

    // organization info mutations:
    replaceWithCreatedOrganization(
      state: State,
      updateOrganizationInfo: OrganizationInfo
    ) {
      state.registrationInfo = updateOrganizationInfo;
    },
    updateGeneralInfo(
      state: State,
      updatedGeneralInfo: OrganizationGeneralInfo
    ) {
      state.registrationInfo.generalInfo = updatedGeneralInfo;
    },
    addTeam(state: State) {
      const teamCount = state.registrationInfo.teams.length;
      state.registrationInfo.teams.push({
        name: `تیم ${teamCount + 1}`, //TODO set a dynamic name for each team we create
        members: [new TeamMember(), new TeamMember(), new TeamMember()],
        link: "",
      });
    },
    removeTeam(state: State, team: Team) {
      // TODO: adjust team names to be unique and in accordance with the team index
      if (state.registrationInfo.teams.length === 1) {
        // TODO alert user that they can't just remove the last team
        return;
      }
      state.registrationInfo.teams.splice(
        state.registrationInfo.teams.indexOf(team),
        1
      );
    },
    addAMemberToTeam(state: State, targetTeam: Team) {
      if (targetTeam.members.length === MAXIMUM_TEAM_SIZE) return;
      // at most MAXIMUM_TEAM_SIZE members can be added to a team
      const team = state.registrationInfo.teams.find(
        (team) => team === targetTeam
      );
      if (team == undefined) {
        console.error("target team does not exist in state");
        return;
      }
      team.members.push(new TeamMember());
    },
    removeMemberFromTeam(state: State, { team, member }) {
      if (team.members.length === MINIMUM_TEAM_SIZE) return; // at least 3 members required
      const targetTeam = state.registrationInfo.teams.find((t) => t === team);
      if (targetTeam === undefined) {
        console.error("target team does not exist");
        return;
      }
      targetTeam.members.splice(team.members.indexOf(member), 1);
    },
    // end of organization info mutations
    setLoading(state: State, loading: boolean) {
      state.loading = loading;
    },
    setProgress(state: State, newStepIndex: number) {
      if (newStepIndex < state.progress) {
        return;
      }
      if (Math.abs(newStepIndex - state.progress) > 1) {
        return;
      }
      state.progress = newStepIndex;
    },
    setStats(state: State, stats: Stats) {
      state.stats = stats;
    },
  },
});

export default store;
