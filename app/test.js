ProjectsSchema = new SimpleSchema({
  "name": {
    type: String,
    label: "Project Name"
  },
  "projectDescription": {
    type: String,
    label: "Project Description"
  },
  "projectSummary": {
    type: String,
    label: "Project Summary"
  },
  "contactPersonId": {
    type: String,
    label: "Contact Person ID",
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  "problemDescription": {
    type: String,
    label: "Problem Description"
  },
  "problemCategories": {
    type: [String],
    label: "Problem Categories"
  },
  "tags": {
    type: [String],
    label: "Tags"
  },
  "teamIds": {
    type: [String],
    label: "Team IDs",
    regEx: SimpleSchema.RegEx.Id,
