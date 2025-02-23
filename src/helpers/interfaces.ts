import { ENV_KEY } from "./enum.js";

export interface generalResponse<T>  {
    isSuccess: boolean,
    value: T | null,
    sMessage: string
}

export interface OptionsPromt{
    name: string,
    value: string | number
}

export interface EnvKey {
    key: ENV_KEY; 
    value: string | null;
  }

  export interface GetProjectsResponse {
    maxResults: number;
    startAt:    number;
    total:      number;
    isLast:     boolean;
    values:     JiraProject[];
}

export interface JiraProject {
    id:        number;
    self:      string;
    name:      string;
    type:      string;
    location:  ProjectLocation;
    isPrivate: boolean;
}


export interface ProjectLocation {
    projectId:      number;
    displayName:    string;
    projectName:    string;
    projectKey:     string;
    projectTypeKey: string;
    avatarURI:      string;
    name:           string;
}



export interface Sprint {
    id:            number;
    self:          string;
    state:         string;
    name:          string;
    startDate:     Date;
    endDate:       Date;
    createdDate:   Date;
    originBoardId: number;
    goal:          string;
}

