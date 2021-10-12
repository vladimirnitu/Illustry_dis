import * as projectLib from '../lib/project'
import { FileProperties } from '../types/fileproperties'
import { Project } from '../types/project'


export function createProjectfromExtern(project: any, next: any) {
    return Promise.resolve()
    .then(() => { return projectLib.createProjectfromExtern(project, next) })
}

 

export function updateProjectfromEtern(project: any, next: any) {
    return Promise.resolve()
    .then(() => { return projectLib.updateProjectfromEtern(project, next) })
}

export function getOneProjectfromEtern(project: any, next: any) {
    return Promise.resolve()
    .then(() => { return projectLib.getOneProjectfromEtern(project, next) })
}
 
export function createIllustryProject(file: FileProperties, project: Project, next: any) {
    return Promise.resolve()
        .then(() => { return projectLib.createIllustryProject(file, project, next) })
}


export function findOneProject(projectName: string, next: any) {
    return Promise.resolve()
        .then(() => { return projectLib.findOneProject(projectName, next) })
}

 

export function queryAllProjects(next: any) {
    return Promise.resolve()
        .then(() => { return projectLib.queryAllProjects(next) })
}
 
 
export function updateProject(projectName: string, projectDescription: string, next: any) {
    return Promise.resolve()
        .then(() => { return projectLib.updateProject(projectName, projectDescription, next) })
}

export function deleteProject(projectName: string, next: any) {
    return Promise.resolve()
        .then(() => { return projectLib.deleteProject(projectName, next) })
}