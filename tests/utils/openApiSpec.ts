import * as fs from "fs";
import SwaggerParser from "@apidevtools/swagger-parser";
import OpenAPIResponseValidator from "openapi-response-validator";
import path from "path";
import yaml from "js-yaml";

const swaggerPath = path.resolve(__dirname, "../../swagger.yaml");
const swaggerAsYaml = fs.readFileSync(swaggerPath, "utf-8");
const swaggerAsJson = yaml.load(swaggerAsYaml);
const swaggerSpec = async () => await SwaggerParser.validate(swaggerAsJson);

export const getAccountsResponseValidatior = async () => {
  const spec = (await swaggerSpec()) as any;
  return new OpenAPIResponseValidator({
    responses: spec.paths["/accounts/v1/accounts"].get.responses,
  });
};

export const getAccountsByIdResponseValidatior = async () => {
  const spec = (await swaggerSpec()) as any;
  return new OpenAPIResponseValidator({
    responses: spec.paths["/accounts/v1/accounts/{accountId}"].get.responses,
  });
};
