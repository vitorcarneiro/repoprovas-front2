import axios from "axios";

const baseAPI = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
});

interface UserData {
  email: string;
  password: string;
}

function getConfig(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

async function signUp(signUpData: UserData) {
  await baseAPI.post("/sign-up", signUpData);
}

async function signIn(signInData: UserData) {
  return baseAPI.post<{ token: string }>("/sign-in", signInData);
}

export interface Term {
  id: number;
  number: number;
}

export interface Discipline {
  id: number;
  name: string;
  teacherDisciplines: TeacherDisciplines[];
  term: Term;
}

export interface TeacherDisciplines {
  id: number;
  discipline: Discipline;
  teacher: Teacher;
  tests: Test[];
}

export interface Teacher {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Test {
  id: number;
  name: string;
  pdfUrl: string;
  category: Category;
  views: number
}

export type TestByDiscipline = Term & {
  disciplines: Discipline[];
};

export type TestByTeacher = TeacherDisciplines & {
  teacher: Teacher;
  disciplines: Discipline[];
  tests: Test[];
};

async function getTestsByDiscipline(token: string) {
  const config = getConfig(token);
  return baseAPI.get<{ tests: TestByDiscipline[] }>(
    "/tests?groupBy=disciplines",
    config
  );
}

async function getTestsByTeacher(token: string) {
  const config = getConfig(token);
  return baseAPI.get<{ tests: TestByTeacher[] }>(
    "/tests?groupBy=teachers",
    config
  );
}

async function getCategories(token: string) {
  const config = getConfig(token);
  return baseAPI.get<{ categories: Category[] }>("/categories", config);
}

export interface TestsInfos {
  categories: Category[],
  teachersDisciplines: TeacherDisciplines[]
}

async function getInfoForCreateTest(token: string) {
  const config = getConfig(token);
  return baseAPI.get(
    "/tests/info",
    config
  );
}

interface TestData {
  name: string;
  pdfUrl: string;
  categoryId: number;
  teacherDisciplineId: number;
}

async function createTest(token: string, testData: TestData) {
  const config = getConfig(token);
  return baseAPI.post("/tests/create", testData, config);
}

async function addTestView(token: string, testId: number) {
  const config = getConfig(token);
  return baseAPI.patch(`/tests/${testId}/addView`, null, config);
}

const api = {
  signUp,
  signIn,
  getTestsByDiscipline,
  getTestsByTeacher,
  getCategories,
  getInfoForCreateTest,
  createTest,
  addTestView,
};

export default api;
