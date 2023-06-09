import axios from "axios";

// const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";
// const BASE_URL = "https://ob1-jobly-backend.herokuapp.com"
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */




class JoblyApi {
  static token;

  //there are multiple ways to pass an authorization token, this is how you pass it in the header.
  //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.


  static async request(endpoint, data = {}, method = "get", customHeaders = {}) {
    // console.debug("API Call:", endpoint, data, method);
    const url = `${BASE_URL}/${endpoint}`;

    const headers = { ...customHeaders, Authorization: `Bearer ${JoblyApi.token}` };
    const params = (method === "get") ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }


  // Individual API routes

  static async getCompany(handle) {
    let res = await this.request(`companies/${handle}`);
    return res.company;
  }

  static async getCompanies(searchFilters) {
    let res = await this.request("companies", searchFilters);
    return res.companies;
  }

  static async getJob(id) {
    let res = await this.request(`jobs/${id}`);
    return res.job;
  }

  static async getJobs(searchFilters) {
    let res = await this.request("jobs", searchFilters);
    return res.jobs;
  }

  // remove this and un-needed routes once done testing
  static async getUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }


  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  // remove auth/username and un-needed routes once done testing
  static async getCurrentUsername(token) {
    let res = await this.request(`auth/username`, { token });
    return res.username;
  }



  static async updateUser(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }

  static async loginUser(credentials) {
    let res = await this.request(`auth/token`, credentials, "post");
    return res.token;
  }

  static async registerUser(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res.token;
  }

  static async applyToJob(username, jobId) {
    await this.request(`users/${username}/jobs/${jobId}`, {}, "post");
  }

  static async unapplyToJob(username, jobId) {
    await this.request(`users/${username}/jobs/${jobId}`, {}, "delete");
  }

  static async getAppliedJobs(username) {
    let res = await this.request(`users/${username}`);
    return res.user.applications;
  }
}

export default JoblyApi;
