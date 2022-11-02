#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { FinalDataProjStack } from '../lib/final_data_proj-stack';

const app = new cdk.App();
new FinalDataProjStack(app, 'FinalDataProjStack');
