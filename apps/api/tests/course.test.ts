import { describe, expect, test, vi } from 'vitest';
import { CourseController } from '../src/controllers/CourseController';
import { CourseModel } from '../src/models/CourseModel';
import { makeHttp } from './utils/http';
import { mockCourseTime, mockCourseTime2, mockCourseTimeInput, mockCourseTimeInput2 } from './utils/fixtures';

vi.mock('@/models/CourseModel')

describe('CourseController.createCourse', () => {
  test('should return formatted course', async () => {
    vi.clearAllMocks()
    const { req, res } = makeHttp()
    req.body = mockCourseTimeInput

    vi.mocked(CourseModel.insertCourse).mockResolvedValue(mockCourseTime)
    await CourseController.createCourse(req, res)

    expect(CourseModel.insertCourse).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)
  });

  test('should NOT return formatted course (no course given in req)', async () => {
    vi.clearAllMocks()
    const { req, res } = makeHttp()

    vi.mocked(CourseModel.insertCourse).mockResolvedValue(mockCourseTime)
    await CourseController.createCourse(req, res)

    expect(CourseModel.insertCourse).toHaveBeenCalledTimes(0)
    expect(res.status).toHaveBeenCalledWith(400)
  });
});

describe('CourseController.updateCourse', () => {
  test('should update course', async () => {
    vi.clearAllMocks()
    const { req, res } = makeHttp()
    req.body = mockCourseTimeInput2

    vi.mocked(CourseModel.updateCourse).mockResolvedValue(mockCourseTime2)
    await CourseController.updateCourse(req, res)

    expect(CourseModel.updateCourse).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)
  });
});