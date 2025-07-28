/**
 * @swagger
 * tags:
 *   - name: Cohorts
 *     description: Cohort management endpoints
 * 
 * /api/cohorts:
 *   get:
 *     tags: [Cohorts]
 *     summary: Get all cohorts with pagination and filtering
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
 *         description: Search by cohort name or program
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by year
 *       - in: query
 *         name: program
 *         schema:
 *           type: string
 *         description: Filter by program
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: Cohorts retrieved successfully
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
 *                         allOf:
 *                           - $ref: '#/components/schemas/Cohort'
 *                           - type: object
 *                             properties:
 *                               studentCount:
 *                                 type: integer
 *                                 description: Number of students in cohort
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 * 
 *   post:
 *     tags: [Cohorts]
 *     summary: Create a new cohort
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cohortName
 *               - program
 *               - year
 *               - startDate
 *               - endDate
 *             properties:
 *               cohortName:
 *                 type: string
 *                 minLength: 1
 *                 description: Cohort name
 *               program:
 *                 type: string
 *                 minLength: 1
 *                 description: Program name
 *               year:
 *                 type: integer
 *                 minimum: 2000
 *                 description: Academic year
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Cohort start date
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Cohort end date
 *               description:
 *                 type: string
 *                 description: Cohort description
 *               isActive:
 *                 type: boolean
 *                 default: true
 *                 description: Cohort active status
 *     responses:
 *       201:
 *         description: Cohort created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Cohort'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 * 
 * /api/cohorts/{id}:
 *   get:
 *     tags: [Cohorts]
 *     summary: Get cohort by ID with students
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cohort ID
 *     responses:
 *       200:
 *         description: Cohort retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       allOf:
 *                         - $ref: '#/components/schemas/Cohort'
 *                         - type: object
 *                           properties:
 *                             Students:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/Student'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 * 
 *   put:
 *     tags: [Cohorts]
 *     summary: Update cohort
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cohort ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cohortName:
 *                 type: string
 *                 minLength: 1
 *               program:
 *                 type: string
 *                 minLength: 1
 *               year:
 *                 type: integer
 *                 minimum: 2000
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cohort updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Cohort'
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
 *     tags: [Cohorts]
 *     summary: Delete cohort
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cohort ID
 *     responses:
 *       200:
 *         description: Cohort deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Cannot delete cohort with enrolled students
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

module.exports = {};