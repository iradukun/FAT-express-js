/**
 * @swagger
 * tags:
 *   - name: Activity Tracker
 *     description: Facilitator activity tracking endpoints
 * 
 * /api/activity-logs:
 *   get:
 *     tags: [Activity Tracker]
 *     summary: Get all activity logs with pagination and filtering
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: allocationId
 *         schema:
 *           type: integer
 *         description: Filter by course allocation ID
 *       - in: query
 *         name: weekNumber
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 52
 *         description: Filter by week number
 *       - in: query
 *         name: facilitatorId
 *         schema:
 *           type: integer
 *         description: Filter by facilitator ID (managers only)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Done, Pending, Not Started]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Activity logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ActivityTrackerWithAllocation'
 *                     meta:
 *                       $ref: '#/components/schemas/PaginationMeta'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 * 
 *   post:
 *     tags: [Activity Tracker]
 *     summary: Create a new activity log
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - allocationId
 *               - weekNumber
 *             properties:
 *               allocationId:
 *                 type: integer
 *                 description: Course allocation ID
 *               weekNumber:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 52
 *                 description: Week number
 *               attendance:
 *                 type: array
 *                 items:
 *                   type: boolean
 *                 description: Array of attendance status
 *               formativeOneGrading:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *                 default: Not Started
 *               formativeTwoGrading:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *                 default: Not Started
 *               summativeGrading:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *                 default: Not Started
 *               courseModeration:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *                 default: Not Started
 *               intranetSync:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *                 default: Not Started
 *               gradeBookStatus:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *                 default: Not Started
 *     responses:
 *       201:
 *         description: Activity log created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ActivityTrackerWithAllocation'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         description: Activity log already exists for this allocation and week
 * 
 * /api/activity-logs/{id}:
 *   get:
 *     tags: [Activity Tracker]
 *     summary: Get activity log by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Activity log ID
 *     responses:
 *       200:
 *         description: Activity log retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ActivityTrackerWithAllocation'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 * 
 *   put:
 *     tags: [Activity Tracker]
 *     summary: Update activity log
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Activity log ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attendance:
 *                 type: array
 *                 items:
 *                   type: boolean
 *                 description: Array of attendance status
 *               formativeOneGrading:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *               formativeTwoGrading:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *               summativeGrading:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *               courseModeration:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *               intranetSync:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *               gradeBookStatus:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *     responses:
 *       200:
 *         description: Activity log updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ActivityTrackerWithAllocation'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 * 
 *   delete:
 *     tags: [Activity Tracker]
 *     summary: Delete activity log
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Activity log ID
 *     responses:
 *       200:
 *         description: Activity log deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 * 
 * /api/activity-logs/facilitator/{facilitatorId}:
 *   get:
 *     tags: [Activity Tracker]
 *     summary: Get activity logs by facilitator
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: facilitatorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Facilitator ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: weekNumber
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 52
 *         description: Filter by week number
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Done, Pending, Not Started]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Activity logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ActivityTrackerWithAllocation'
 *                     meta:
 *                       $ref: '#/components/schemas/PaginationMeta'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 * 
 * /api/activity-logs/course/{allocationId}:
 *   get:
 *     tags: [Activity Tracker]
 *     summary: Get activity logs by course allocation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: allocationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course allocation ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: weekNumber
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 52
 *         description: Filter by week number
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Done, Pending, Not Started]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Activity logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ActivityTrackerWithAllocation'
 *                     meta:
 *                       $ref: '#/components/schemas/PaginationMeta'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 * 
 * components:
 *   schemas:
 *     ActivityTrackerWithAllocation:
 *       allOf:
 *         - $ref: '#/components/schemas/ActivityTracker'
 *         - type: object
 *           properties:
 *             allocation:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 module:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     code:
 *                       type: string
 *                     name:
 *                       type: string
 *                 class:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     code:
 *                       type: string
 *                     trimester:
 *                       type: string
 *                     year:
 *                       type: integer
 *                 cohort:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     program:
 *                       type: string
 *                 facilitator:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     employeeId:
 *                       type: string
 *                 mode:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 */

module.exports = {};