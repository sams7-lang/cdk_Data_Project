#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const final_data_proj_stack_1 = require("../lib/final_data_proj-stack");
const app = new cdk.App();
new final_data_proj_stack_1.FinalDataProjStack(app, 'FinalDataProjStack');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluYWxfZGF0YV9wcm9qLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmluYWxfZGF0YV9wcm9qLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHFDQUFxQztBQUNyQyx3RUFBa0U7QUFFbEUsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsSUFBSSwwQ0FBa0IsQ0FBQyxHQUFHLEVBQUUsb0JBQW9CLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEZpbmFsRGF0YVByb2pTdGFjayB9IGZyb20gJy4uL2xpYi9maW5hbF9kYXRhX3Byb2otc3RhY2snO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xubmV3IEZpbmFsRGF0YVByb2pTdGFjayhhcHAsICdGaW5hbERhdGFQcm9qU3RhY2snKTtcbiJdfQ==