USE MASTER

CREATE DATABASE AttendanceSystem
GO

USE AttendanceSystem
GO

-- Create Table
CREATE TABLE SysRole
(
	[role_id] TINYINT IDENTITY(1, 1) NOT NULL,
	[role_name] NVARCHAR(256) NULL,
	[status] BIT NULL,
	[creator_id] INT NULL,
	[updater_id] INT NULL,
	[create_time] DATETIME NULL,
	[update_time] DATETIME NULL
)
ALTER TABLE SysRole ADD CONSTRAINT PK_SysRole PRIMARY KEY CLUSTERED(role_id) ON [PRIMARY]
GO

CREATE TABLE SysUser
(
	[user_id] INT IDENTITY(1, 1) NOT NULL,
	[email] VARCHAR(64) NULL,
	[username] VARCHAR(64) NULL,
	[password] VARCHAR(128) NULL,
	[nickname] NVARCHAR(256) NULL,
	[phone] VARCHAR(32) NULL,
	[avatar_path] VARCHAR(128) NULL,
	[face_image_path] VARCHAR(128) NULL,
	[role_id] TINYINT,
	[status] BIT NULL,
	[creator_id] INT NULL,
	[updater_id] INT NULL,
	[create_time] DATETIME NULL,
	[update_time] DATETIME NULL
)

ALTER TABLE SysUser ADD CONSTRAINT PK_SysUser PRIMARY KEY CLUSTERED(user_id) ON [PRIMARY]
ALTER TABLE SysUser ADD CONSTRAINT FK_SysUserRole FOREIGN KEY(role_id) REFERENCES SysRole(role_id)
GO

CREATE TABLE Course
(
	[course_code] VARCHAR(32) NOT NULL,
	[course_name] NVARCHAR(256) NULL,
	[credit] INT NULL,
	[description] NVARCHAR(512) NULL,
	[status] BIT NULL,
	[creator_id] INT NULL,
	[updater_id] INT NULL,
	[create_time] DATETIME NULL,
	[update_time] DATETIME NULL
)
ALTER TABLE Course ADD CONSTRAINT PK_Course PRIMARY KEY CLUSTERED(course_code) ON [PRIMARY]
GO

CREATE TABLE Classroom
(
	[classroom_code] VARCHAR(32) NOT NULL,
	[capacity] INT NULL,
	[floor] INT NULL,
	[description] NVARCHAR(256) NULL,
	[status] BIT NULL,
	[creator_id] INT NULL,
	[updater_id] INT NULL,
	[create_time] DATETIME NULL,
	[update_time] DATETIME NULL
)
ALTER TABLE Classroom ADD CONSTRAINT PK_Classroom PRIMARY KEY CLUSTERED(classroom_code) ON [PRIMARY]
GO

CREATE TABLE Shift
(
	[shift_code] VARCHAR(32) NOT NULL,
	[start_time] CHAR(5) NULL,
	[end_time] CHAR(5) NULL,
	[break_hour] NUMERIC(19, 5) NULL,
	[status] BIT NULL,
	[creator_id] INT NULL,
	[updater_id] INT NULL,
	[create_time] DATETIME NULL,
	[update_time] DATETIME NULL
)
ALTER TABLE Shift ADD CONSTRAINT PK_Shift PRIMARY KEY CLUSTERED(shift_code) ON [PRIMARY]
GO

CREATE TABLE CourseGroup
(
	[course_group_id] INT IDENTITY(1, 1) NOT NULL,
	[course_code] VARCHAR(32) NULL,
	[group_code] VARCHAR(32) NULL,
	[teacher_id] INT NULL,
	[total_student_qty] INT NULL,
	[status] BIT NULL,
	[creator_id] INT NULL,
	[updater_id] INT NULL,
	[create_time] DATETIME NULL,
	[update_time] DATETIME NULL
)
ALTER TABLE CourseGroup ADD CONSTRAINT PK_CourseGroup PRIMARY KEY CLUSTERED(course_group_id) ON [PRIMARY]
ALTER TABLE CourseGroup ADD CONSTRAINT FK_CourseGroupCourse FOREIGN KEY(course_code) REFERENCES Course(course_code)
ALTER TABLE CourseGroup ADD CONSTRAINT FK_CourseGroupUserTeacher FOREIGN KEY(teacher_id) REFERENCES SysUser(user_id)
GO

CREATE TABLE CourseGroupStudentList
(
	[course_group_id] INT NOT NULL,
	[student_id] INT NOT NULL,
	[total_absent] NUMERIC(19, 5) NULL,
	[ban_yn] BIT NULL,
	[status] BIT NULL,
	[creator_id] INT NULL,
	[updater_id] INT NULL,
	[create_time] DATETIME NULL,
	[update_time] DATETIME NULL
)
ALTER TABLE CourseGroupStudentList ADD CONSTRAINT PK_CourseGroupStudentList PRIMARY KEY CLUSTERED(course_group_id, student_id) ON [PRIMARY]
ALTER TABLE CourseGroupStudentList ADD CONSTRAINT FK_CourseGroupStudentListCourseGroup FOREIGN KEY(course_group_id) REFERENCES CourseGroup(course_group_id)
ALTER TABLE CourseGroupStudentList ADD CONSTRAINT FK_CourseGroupStudentListUserStudent FOREIGN KEY(student_id) REFERENCES SysUser(user_id)
GO

CREATE TABLE Schedule
(
	[course_group_id] INT NOT NULL,
	[shift_code] VARCHAR(32) NOT NULL,
	[classroom_code] VARCHAR(32) NOT NULL,
	[date_from] DATE NOT NULL,
	[date_to] DATE NOT NULL,
	[week_day] TINYINT NULL,
	[exclude_week] VARCHAR(32),
	[status] BIT NULL,
	[creator_id] INT NULL,
	[updater_id] INT NULL,
	[create_time] DATETIME NULL,
	[update_time] DATETIME NULL
)
ALTER TABLE Schedule ADD CONSTRAINT PK_Schedule PRIMARY KEY CLUSTERED(course_group_id, shift_code, classroom_code, date_from, date_to) ON [PRIMARY]
ALTER TABLE Schedule ADD CONSTRAINT FK_ScheduleCourseGroup FOREIGN KEY(course_group_id) REFERENCES CourseGroup(course_group_id)
ALTER TABLE Schedule ADD CONSTRAINT FK_ScheduleShift FOREIGN KEY(shift_code) REFERENCES Shift(shift_code)
ALTER TABLE Schedule ADD CONSTRAINT FK_ScheduleClassroom FOREIGN KEY(classroom_code) REFERENCES Classroom(classroom_code)
GO

CREATE TABLE AttendanceRawData
(
	[student_id] INT NOT NULL,
	[course_group_id] INT NOT NULL,
	[attend_date] DATE NOT NULL,
	[attend_type] TINYINT NOT NULL,
	[attend_time] CHAR(5) NULL,
	[attend_image_path] VARCHAR(128) NULL,
	[creator_id] INT NULL,
	[create_time] DATETIME NULL
)
ALTER TABLE AttendanceRawData ADD CONSTRAINT PK_AttendanceRawData PRIMARY KEY CLUSTERED(student_id, course_group_id, attend_date, attend_type) ON [PRIMARY]
ALTER TABLE AttendanceRawData ADD CONSTRAINT FK_AttendanceRawDataUserStudent FOREIGN KEY(student_id) REFERENCES SysUser(user_id)
ALTER TABLE AttendanceRawData ADD CONSTRAINT FK_AttendanceRawDataCourseGroup FOREIGN KEY(course_group_id) REFERENCES CourseGroup(course_group_id)
GO

CREATE TABLE Attendance
(
	[attendance_id] INT IDENTITY(1, 1) NOT NULL,
	[student_id] INT NOT NULL,
	[course_group_id] INT NOT NULL,
	[attend_date] DATE NOT NULL,
	[enter_time] CHAR(5) NULL,
	[leave_time] CHAR(5) NULL,
	[note] NVARCHAR(256) NULL,
	[status] BIT NULL,
	[creator_id] INT NULL,
	[updater_id] INT NULL,
	[create_time] DATETIME NULL,
	[update_time] DATETIME NULL
)
ALTER TABLE Attendance ADD CONSTRAINT PK_Attendance PRIMARY KEY CLUSTERED(student_id, course_group_id, attend_date) ON [PRIMARY]
ALTER TABLE Attendance ADD CONSTRAINT FK_AttendanceUserStudent FOREIGN KEY(student_id) REFERENCES SysUser(user_id)
ALTER TABLE Attendance ADD CONSTRAINT FK_AttendanceCourseGroup FOREIGN KEY(course_group_id) REFERENCES CourseGroup(course_group_id)
GO

CREATE TABLE SysComment
(
	[comment_id] INT IDENTITY(1, 1) NOT NULL,
	[root_id] INT NULL,
	[parent_id] INT NULL,
	[ref_id] INT NULL,
	[ref_table] VARCHAR(32) NULL,
	[commenter_id] INT NULL,
	[content] NVARCHAR(256) NULL,
	[status] BIT NULL,
	[creator_id] INT NULL,
	[updater_id] INT NULL,
	[create_time] DATETIME NULL,
	[update_time] DATETIME NULL
)
ALTER TABLE SysComment ADD CONSTRAINT PK_SysComment PRIMARY KEY CLUSTERED(comment_id) ON [PRIMARY]
ALTER TABLE SysComment ADD CONSTRAINT FK_SysCommentUserCommenter FOREIGN KEY(commenter_id) REFERENCES SysUser(user_id)
GO

CREATE TABLE SysNotify
(
	[notify_id] INT IDENTITY(1, 1) NOT NULL,
	[sender_id] INT NULL,
	[receiver_id] INT NULL,
	[title] NVARCHAR(256) NULL,
	[content] NVARCHAR(1024) NULL,
	[ref_id] INT NULL,
	[ref_table] VARCHAR(32) NULL,
	[status] BIT NULL,
	[creator_id] INT NULL,
	[updater_id] INT NULL,
	[create_time] DATETIME NULL,
	[update_time] DATETIME NULL
)
ALTER TABLE SysNotify ADD CONSTRAINT PK_SysNotify PRIMARY KEY CLUSTERED(notify_id) ON [PRIMARY]
ALTER TABLE SysNotify ADD CONSTRAINT FK_SysNotifyUserSender FOREIGN KEY(sender_id) REFERENCES SysUser(user_id)
ALTER TABLE SysNotify ADD CONSTRAINT FK_SysNotifyUserReceiver FOREIGN KEY(receiver_id) REFERENCES SysUser(user_id)
GO

-- Select Table
SELECT *
FROM SysRole
SELECT *
FROM SysUser

SELECT *
FROM Course
SELECT *
FROM Classroom
SELECT *
FROM Shift

SELECT *
FROM CourseGroup
SELECT *
FROM CourseGroupStudentList
SELECT *
FROM Schedule

SELECT *
FROM AttendanceRawData
SELECT *
FROM Attendance

SELECT *
FROM SysComment
SELECT *
FROM SysNotify

-- Chay dong nay nha Phuoc
CREATE TABLE keyStore
(
	[user_id] INT NOT NULL PRIMARY KEY,
	[privateKey] VARCHAR(256) NOT NULL,
	[publicKey] VARCHAR(256) NOT NULL,
	[refreshTokenUsing] VARCHAR(512) Unique NOT NULL,
	[create_time] DATETIME NULL,
	[update_time] DATETIME NULL,
	CONSTRAINT FK_User FOREIGN KEY (user_id) REFERENCES SysUser(user_id)
)

-- Update 2 nha Phuoc them khoa và khóa

CREATE TABLE Faculty
(
	[faculty_id] INT NOT NULL PRIMARY KEY,
	[faculty_name] NVARCHAR(256) NOT NULL,
	[creator_id] INT NOT NULL,
	[updater_id] INT NOT NULL,
	[create_time] DATETIME NULL,
	[update_time] DATETIME NULL,
)

ALTER TABLE SysUser
ADD course_year INT NULL,
    faculty_id INT NULL,
	gender Bit Null;


ALTER TABLE SysUser
ADD CONSTRAINT FK_SysUser_Faculty FOREIGN KEY (faculty_id) REFERENCES Faculty(faculty_id);

ALTER TABLE Course
ADD faculty_id INT NULL;

ALTER TABLE Course
ADD CONSTRAINT FK_Course_Faculty FOREIGN KEY (faculty_id) REFERENCES Faculty(faculty_id);

ALTER TABLE Faculty
ADD CONSTRAINT FK_Faculty_SysUser FOREIGN KEY (creator_id) REFERENCES SysUser(user_id);

ALTER TABLE Faculty
ADD CONSTRAINT FK_Faculty_SysUser2 FOREIGN KEY (updater_id) REFERENCES SysUser(user_id);

--- 3 So cuoi dien thoai + Ten khong dau (Chu cai dau viet hoa) + 4 so cuoi mssv

--- Update new Create ClassRoomShift
CREATE TABLE ClassRoomShift
(
	classroomshift_id INT IDENTITY(1, 1) NOT NULL,
	classroom_code VARCHAR(32),
	shift_code VARCHAR(32),
	status BIT DEFAULT 0,
	[creator_id] INT NULL,
	[updater_id] INT NULL,
	[create_time] DATETIME NULL,
	[update_time] DATETIME NULL,
	FOREIGN KEY (classroom_code) REFERENCES Classroom(classroom_code),
	FOREIGN KEY (shift_code) REFERENCES Shift(shift_code)
);
ALTER TABLE ClassRoomShift ADD CONSTRAINT PK_ClassRoomShift PRIMARY KEY CLUSTERED(classroomshift_id) ON [PRIMARY]

-- Update 26/07
ALTER TABLE CourseGroup
ADD classroomshift_id INT UNIQUE

ALTER TABLE CourseGroup
ADD CONSTRAINT FK_CourseGroup_ClassRoomShift2 FOREIGN KEY (classroomshift_id) REFERENCES ClassRoomShift(classroomshift_id);

--- Update PostGroup - cac bài đăng trong nhóm

CREATE TABLE PostGroup
(
	post_id INT IDENTITY(1, 1) NOT NULL,
	course_group_id INT,
	title NVARCHAR(256) NOT NULL,
	content NVARCHAR(1024) NOT NULL,
	file_link VARCHAR(256),
	status BIT DEFAULT 0,
	[creator_id] INT NULL,
	[updater_id] INT NULL,
	[create_time] DATETIME NULL,
	[update_time] DATETIME NULL,
	FOREIGN KEY (course_group_id) REFERENCES CourseGroup(course_group_id),

);
ALTER TABLE PostGroup ADD CONSTRAINT PK_PostGroup PRIMARY KEY CLUSTERED(post_id) ON [PRIMARY]

ALTER TABLE PostGroup
ADD CONSTRAINT FK_PostGroup_CourseGroup FOREIGN KEY (course_group_id) REFERENCES CourseGroup(course_group_id);