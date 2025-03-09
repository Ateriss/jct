import { ENV_KEY } from "./enum";

export interface GeneralResponse<T>  {
    isSuccess: boolean,
    value: T | null,
    sMessage: string
}

export interface OptionsPromt<T>{
    name: string,
    value: T
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

export interface FormattedIssue {
    key: string;
    type: string;
    icon: string;
    status: string;
    name: string;
}

export interface Issue {
    expand: string;
    id:     string;
    self:   string;
    key:    string;
    fields: IssueFields;
}

export interface IssueFields {
    statuscategorychangedate:      string;
    issuetype:                     Issuetype;
    timespent:                     null;
    sprint:                        Sprint;
    customfield_10030:             null;
    project:                       Project;
    customfield_10031:             null;
    fixVersions:                   any[];
    customfield_10033:             null;
    customfield_10034:             null;
    aggregatetimespent:            null;
    resolution:                    null;
    customfield_10035:             null;
    customfield_10037:             null;
    customfield_10027:             null;
    customfield_10028:             null;
    customfield_10029:             null;
    resolutiondate:                null;
    workratio:                     number;
    issuerestriction:              Issuerestriction;
    lastViewed:                    null;
    watches:                       Watches;
    created:                       string;
    customfield_10020:             Customfield10020[];
    customfield_10021:             null;
    epic:                          null;
    customfield_10022:             null;
    priority:                      Priority;
    customfield_10023:             null;
    customfield_10024:             null;
    customfield_10025:             null;
    customfield_10026:             null;
    labels:                        string[];
    customfield_10016:             number;
    customfield_10017:             null;
    customfield_10018:             Customfield10018;
    customfield_10019:             string;
    timeestimate:                  null;
    aggregatetimeoriginalestimate: null;
    versions:                      any[];
    issuelinks:                    Issuelink[];
    assignee:                      Assignee;
    updated:                       string;
    status:                        Status;
    components:                    any[];
    timeoriginalestimate:          null;
    description:                   string;
    customfield_10010:             null;
    customfield_10014:             null;
    timetracking:                  Timetracking;
    customfield_10015:             null;
    customfield_10005:             null;
    customfield_10006:             null;
    security:                      null;
    customfield_10007:             null;
    customfield_10008:             null;
    customfield_10009:             null;
    aggregatetimeestimate:         null;
    attachment:                    any[];
    flagged:                       boolean;
    summary:                       string;
    creator:                       Assignee;
    subtasks:                      any[];
    customfield_10040:             null;
    customfield_10041:             null;
    customfield_10042:             null;
    customfield_10043:             string;
    reporter:                      Assignee;
    aggregateprogress:             Progress;
    customfield_10000:             string;
    customfield_10001:             null;
    customfield_10002:             any[];
    customfield_10003:             null;
    customfield_10004:             null;
    environment:                   null;
    duedate:                       null;
    progress:                      Progress;
    comment:                       Comment;
    votes:                         Votes;
    worklog:                       Worklog;
}

export interface Progress {
    progress: number;
    total:    number;
}

export interface Assignee {
    self:        string;
    accountId:   string;
    avatarUrls:  AvatarUrls;
    displayName: string;
    active:      boolean;
    timeZone:    string;
    accountType: string;
}

export interface AvatarUrls {
    "48x48": string;
    "24x24": string;
    "16x16": string;
    "32x32": string;
}

export interface Comment {
    comments:   any[];
    self:       string;
    maxResults: number;
    total:      number;
    startAt:    number;
}

export interface Customfield10018 {
    hasEpicLinkFieldDependency: boolean;
    showField:                  boolean;
    nonEditableReason:          NonEditableReason;
}

export interface NonEditableReason {
    reason:  string;
    message: string;
}

export interface Customfield10020 {
    id:        number;
    name:      string;
    state:     string;
    boardId:   number;
    goal:      string;
    startDate: Date;
    endDate:   Date;
}

export interface Issuelink {
    id:          string;
    self:        string;
    type:        Type;
    inwardIssue: InwardIssue;
}

export interface InwardIssue {
    id:     string;
    key:    string;
    self:   string;
    fields: InwardIssueFields;
}

export interface InwardIssueFields {
    summary:   string;
    status:    Status;
    priority:  Priority;
    issuetype: Issuetype;
}

export type issueName = 'HISTORIA' | 'TAREA' | 'ERROR' | 'SERVICE DESK' | 'BUG' | 'HISTORY' | 'TASK'

export interface Issuetype {
    self:           string;
    id:             string;
    description:    string;
    iconUrl:        string;
    name:           issueName;
    subtask:        boolean;
    avatarId:       number;
    entityId:       string;
    hierarchyLevel: number;
}

export interface Priority {
    self:    string;
    iconUrl: string;
    name:    string;
    id:      string;
}

export interface Status {
    self:           string;
    description:    string;
    iconUrl:        string;
    name:           string;
    id:             string;
    statusCategory: StatusCategory;
}

export interface StatusCategory {
    self:      string;
    id:        number;
    key:       string;
    colorName: string;
    name:      string;
}

export interface Type {
    id:      string;
    name:    string;
    inward:  string;
    outward: string;
    self:    string;
}

export interface Issuerestriction {
    issuerestrictions: Timetracking;
    shouldDisplay:     boolean;
}

export interface Timetracking {
}

export interface Project {
    self:           string;
    id:             string;
    key:            string;
    name:           string;
    projectTypeKey: string;
    simplified:     boolean;
    avatarUrls:     AvatarUrls;
}

export interface Votes {
    self:     string;
    votes:    number;
    hasVoted: boolean;
}

export interface Watches {
    self:       string;
    watchCount: number;
    isWatching: boolean;
}

export interface Worklog {
    startAt:    number;
    maxResults: number;
    total:      number;
    worklogs:   any[];
}

export interface Commit {
    title: string,
    mesasge: string | null,
    branch: string
}
