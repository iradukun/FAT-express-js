/**
 * @swagger
 * tags:
 *   - name: Course Offerings
 *     description: Course offering management endpoints
 * 
 * /api/course-offerings:
 *   get:
 *     tags: [Course Offerings]
 *     summary: Get all course offerings with pagination and filtering
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by module or facilitator name
 *       - in: query
 *         name: moduleId
 *         schema:
 *           type: integer
 *         description: Filter by module ID
 *       - in: query
 *         name: facilitatorId
 *         schema:
 *           type: integer
 *         description: Filter by facilitator ID
 *       - in: query
 *         name: cohortId
 *         schema:
 *           type: integer
 *         description: Filter by cohort ID
 *       - in: query
 *         name: classId
 *         schema:
 *           type: integer
 *         description: Filter by class ID
 *       - in: query
 *         name: modeId
 *         schema:
 *           type: integer
 *         description: Filter by mode ID
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: Course offerings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/CourseOffering'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 * 
 *   post:
 *     tags: [Course Offerings]
 *     summary: Create a new course offering
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moduleId
 *               - facilitatorId
 *               - cohortId
 *               - classId
 *               - modeId
 *               - startDate
 *               - endDate
 *             properties:
 *               moduleId:
 *                 type: integer
 *                 description: Module ID
 *               facilitatorId:
 *                 type: integer
 *                 description: Facilitator ID
 *               cohortId:
 *                 type: integer
 *                 description: Cohort ID
 *               classId:
 *                 type: integer
 *                 description: Class ID
 *               modeId:
 *                 type: integer
 *                 description: Mode ID (delivery mode)
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Course start date
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Course end date
 *               schedule:
 *                 type: string
 *                 description: Course schedule details
 *               notes:
 *                 type: string
 *                 description: Additional notes
 *               isActive:
 *                 type: boolean
 *                 default: true
 *                 description: Course offering active status
 *     responses:
 *       201:
 *         description: Course offering created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/CourseOffering'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 * 
 * /api/course-offerings/{id}:
 *   get:
 *     tags: [Course Offerings]
 *     summary: Get course offering by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course offering ID
 *     responses:
 *       200:
 *         description: Course offering retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/CourseOffering'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 * 
 *   put:
 *     tags: [Course Offerings]
 *     summary: Update course offering
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course offering ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               moduleId:
 *                 type: integer
 *               facilitatorId:
 *                 type: integer
 *               cohortId:
 *                 type: integer
 *               classId:
 *                 type: integer
 *               modeId:
 *                 type: integer
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               schedule:
 *                 type: string
 *               notes:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Course offering updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/CourseOffering'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 * 
 *   delete:
 *     tags: [Course Offerings]
 *     summary: Delete course offering
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course offering ID
 *     responses:
 *       200:
 *         description: Course offering deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

module.exports = {};