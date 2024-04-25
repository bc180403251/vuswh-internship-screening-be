-- CLEAN DATABASE
-- DELETE FROM `users_permissions`; 
-- DELETE FROM `roles_permissions`;
-- DELETE FROM `users_roles`;
-- DELETE FROM `batches`;
-- DELETE FROM `semesters`;
-- DELETE FROM `permissions`;
-- DELETE FROM `roles`;
-- DELETE FROM `users`;
-- DELETE FROM `subjects`;
-- DELETE FROM `students`;
-- DELETE FROM `users`;
-- DELETE FROM `degrees`;
-- DELETE FROM `phases`;
-- DELETE FROM `phase_histories`;
-- DELETE FROM `eligibility_criterias`;
-- DELETE FROM `eligibility_criteria_subjects`;
-- DELETE FROM `student_registrations`;
-- DELETE FROM `cities`;

INSERT INTO users (id ,fullname, username, email, phone ,password , is_active, is_validated ,created_at)
VALUES (uuid(),"Sarfraz Awan","sawan","sawan@vu.edu.pk","923334947594","$1$8uORbZ9t$r/.J8G8AiH/JOcrb3kmuH0",true,true,curdate());
INSERT INTO users (id ,fullname, username, email, phone ,password , is_active, is_validated,created_at)
VALUES (uuid(),"Wajahat Hasshmi","wajahat","wajahat@vu.edu.pk","923334455669","$1$8uORbZ9t$r/.J8G8AiH/JOcrb3kmuH0",true,true,curdate());
INSERT INTO users (id ,fullname, username, email, phone ,password , is_active,is_validated, created_at)
VALUES (uuid(),"Mohsan Ali","student","student@vu.edu.pk","933328596745","$1$8uORbZ9t$r/.J8G8AiH/JOcrb3kmuH0",true,true,curdate());
INSERT INTO users (id ,fullname, username, email, phone ,password , is_active, is_validated, created_at)
VALUES (uuid(),"Fareed","bc18040325","bc18040346@vu.edu.pk","933328596745","$1$8uORbZ9t$r/.J8G8AiH/JOcrb3kmuH0",true,true,curdate());
INSERT INTO users (id ,fullname, username, email, phone ,password , is_active, is_validated, created_at)
VALUES (uuid(),"Umair Mian","mc220202087","mc220202087jbi@vu.edu.pk","933328596345","$1$8uORbZ9t$r/.J8G8AiH/JOcrb3kmuH0",true,true,curdate());
INSERT INTO users (id ,fullname, username, email, phone ,password , is_active, is_validated, created_at)
VALUES (uuid(),"jawaria bibi","mc220202346","mc220202346jbi@vu.edu.pk","933328593469","$1$8uORbZ9t$r/.J8G8AiH/JOcrb3kmuH0",true,true,curdate());

INSERT INTO users (id ,fullname, username, email, phone ,password , is_active, is_validated ,created_at)
VALUES (uuid(),"Ayesha","mc645346","mc645346@vu.edu.pk","923334947594","$1$8uORbZ9t$r/.J8G8AiH/JOcrb3kmuH0",true,true,curdate());
INSERT INTO users (id ,fullname, username, email, phone ,password , is_active, is_validated,created_at)
VALUES (uuid(),"Amna","bc54345646","bc54345646@vu.edu.pk","923334455669","$1$8uORbZ9t$r/.J8G8AiH/JOcrb3kmuH0",true,true,curdate());
INSERT INTO users (id ,fullname, username, email, phone ,password , is_active,is_validated, created_at)
VALUES (uuid(),"Hadi","mc753573","mc753573@vu.edu.pk","933328596745","$1$8uORbZ9t$r/.J8G8AiH/JOcrb3kmuH0",true,true,curdate());
INSERT INTO users (id ,fullname, username, email, phone ,password , is_active, is_validated, created_at)
VALUES (uuid(),"Hamad","bc1804034","bc1804034@vu.edu.pk","933328596745","$1$8uORbZ9t$r/.J8G8AiH/JOcrb3kmuH0",true,true,curdate());
INSERT INTO users (id ,fullname, username, email, phone ,password , is_active, is_validated, created_at)
VALUES (uuid(),"Abera","mc2202020","mc2202020jbi@vu.edu.pk","933328596345","$1$8uORbZ9t$r/.J8G8AiH/JOcrb3kmuH0",true,true,curdate());
INSERT INTO users (id ,fullname, username, email, phone ,password , is_active, is_validated, created_at)
VALUES (uuid(),"Nida","mc220202386","mc220202386jb@vu.edu.pk","933328593469","$1$8uORbZ9t$r/.J8G8AiH/JOcrb3kmuH0",true,true,curdate());
INSERT INTO users (id ,fullname, username, email, phone ,password , is_active, is_validated ,created_at)
VALUES (uuid(),"WAjeeha","bc657637645","bc657637645@vu.edu.pk","923334947594","$1$8uORbZ9t$r/.J8G8AiH/JOcrb3kmuH0",true,true,curdate());
INSERT INTO users (id ,fullname, username, email, phone ,password , is_active, is_validated,created_at)
VALUES (uuid(),"Amna","bc2546578","bc2546578@vu.edu.pk","923334455669","$1$8uORbZ9t$r/.J8G8AiH/JOcrb3kmuH0",true,true,curdate());
INSERT INTO users (id ,fullname, username, email, phone ,password , is_active,is_validated, created_at)
VALUES (uuid(),"Hmna","mc56578903","mc56578903@vu.edu.pk","933328596745","$1$8uORbZ9t$r/.J8G8AiH/JOcrb3kmuH0",true,true,curdate());
INSERT INTO users (id ,fullname, username, email, phone ,password , is_active, is_validated, created_at)
VALUES (uuid(),"Qasim","bc1804036","bc1804036@vu.edu.pk","933328596745","$1$8uORbZ9t$r/.J8G8AiH/JOcrb3kmuH0",true,true,curdate());
INSERT INTO users (id ,fullname, username, email, phone ,password , is_active, is_validated, created_at)
VALUES (uuid(),"Waqas","mc22020287","mc22020287jbi@vu.edu.pk","933328596345","$1$8uORbZ9t$r/.J8G8AiH/JOcrb3kmuH0",true,true,curdate());
INSERT INTO users (id ,fullname, username, email, phone ,password , is_active, is_validated, created_at)
VALUES (uuid(),"Barirah","mc22202346","mc22202346jbi@vu.edu.pk","933328593469","$1$8uORbZ9t$r/.J8G8AiH/JOcrb3kmuH0",true,true,curdate());
INSERT INTO users (id ,fullname, username, email, phone ,password , is_active, is_validated ,created_at)
VALUES (uuid(),"Aira","mc346575743","mc346575743@vu.edu.pk","923334947594","$1$8uORbZ9t$r/.J8G8AiH/JOcrb3kmuH0",true,true,curdate());
INSERT INTO users (id ,fullname, username, email, phone ,password , is_active, is_validated,created_at)
VALUES (uuid(),"Ayiesh","mc2456734","mc2456734@vu.edu.pk","923334455669","$1$8uORbZ9t$r/.J8G8AiH/JOcrb3kmuH0",true,true,curdate());
INSERT INTO users (id ,fullname, username, email, phone ,password , is_active,is_validated, created_at)
VALUES (uuid(),"Ali","mc23598786","mc23598786@vu.edu.pk","933328596745","$1$8uORbZ9t$r/.J8G8AiH/JOcrb3kmuH0",true,true,curdate());
INSERT INTO users (id ,fullname, username, email, phone ,password , is_active, is_validated, created_at)
VALUES (uuid(),"Atif","bc1804035","bc1804035@vu.edu.pk","933328596745","$1$8uORbZ9t$r/.J8G8AiH/JOcrb3kmuH0",true,true,curdate());
INSERT INTO users (id ,fullname, username, email, phone ,password , is_active, is_validated, created_at)
VALUES (uuid(),"Sultan","mc22002087","mc22002087jbi@vu.edu.pk","933328596345","$1$8uORbZ9t$r/.J8G8AiH/JOcrb3kmuH0",true,true,curdate());
INSERT INTO users (id ,fullname, username, email, phone ,password , is_active, is_validated, created_at)
VALUES (uuid(),"jawaria","mc220202348","mc220202348jbi@vu.edu.pk","933328593469","$1$8uORbZ9t$r/.J8G8AiH/JOcrb3kmuH0",true,true,curdate());
INSERT INTO users (id ,fullname, username, email, phone)
VALUES (uuid(),"Hijab","mc32002087","mc32002087jbi@vu.edu.pk","933328596945");
INSERT INTO users (id ,fullname, username, email, phone )
VALUES (uuid(),"jasim","mc230202348","mc230202348jbi@vu.edu.pk","933328563469");

INSERT INTO roles (id, name, is_default, created_at) VALUES (UUID(), 'admin',default, CURDATE());
INSERT INTO roles (id, name, is_default, created_at) VALUES (UUID(), 'teacher',default,  CURDATE());
INSERT INTO roles (id, name, is_default, created_at) VALUES (UUID(), 'student', default, CURDATE());
INSERT INTO roles (id, name, is_default, created_at) VALUES (UUID(), 'coordinator',default,  CURDATE());
INSERT INTO roles (id, name, is_default, created_at) VALUES (UUID(), 'incharge',default,  CURDATE());
INSERT INTO users (id ,fullname, username, email, phone ,password , is_active, is_validated, created_at)
VALUES
        (uuid(),"asim","bc140325601","bc140325601jbi@vu.edu.pk","+923328893469","$2b$10$S4H/57RDUcUQfkaI7WZVT.7mIIYfliJF6IdTksLegdQQjp7EB1k5e",true,true,curdate()),
        (uuid(),"azeem","bc140405608","bc140405608jbi@vu.edu.pk","+923328893479","$2b$10$S4H/57RDUcUQfkaI7WZVT.7mIIYfliJF6IdTksLegdQQjp7EB1k5e",true,true,curdate());



INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'wajahat'),(SELECT id FROM roles where name = 'coordinator'));
INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'sawan'),(SELECT id FROM roles where name = 'admin'));
INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'sawan'),(SELECT id FROM roles where name = 'incharge'));
INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'student'),(SELECT id FROM roles where name = 'student'));
INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'bc18040325'),(SELECT id FROM roles where name = 'student'));
INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'mc220202087'),(SELECT id FROM roles where name = 'student'));
INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'mc220202346'),(SELECT id FROM roles where name = 'incharge'));
INSERT INTO users_roles(usersid, rolesid)
VALUES 
		((SELECT id from users where username = 'bc140325601'),(SELECT id FROM roles where name = 'Student')),
    ((SELECT id from users where username = 'bc140405608'),(SELECT id FROM roles where name = 'Student'));



INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'mc645346'),(SELECT id FROM roles where name = 'student'));
INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'bc54345646'),(SELECT id FROM roles where name = 'student'));
INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'mc753573'),(SELECT id FROM roles where name = 'student'));
INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'bc1804034'),(SELECT id FROM roles where name = 'student'));
INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'mc2202020'),(SELECT id FROM roles where name = 'student'));
INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'mc220202386'),(SELECT id FROM roles where name = 'student'));
INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'bc657637645'),(SELECT id FROM roles where name = 'student'));
INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'bc2546578'),(SELECT id FROM roles where name = 'student'));
INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'mc56578903'),(SELECT id FROM roles where name = 'student'));
INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'bc1804036'),(SELECT id FROM roles where name = 'student'));
INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'mc22020287'),(SELECT id FROM roles where name = 'student'));
INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'mc22202346'),(SELECT id FROM roles where name = 'student'));
INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'mc346575743'),(SELECT id FROM roles where name = 'student'));
INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'mc2456734'),(SELECT id FROM roles where name = 'student'));
INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'mc23598786'),(SELECT id FROM roles where name = 'student'));
INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'bc1804035'),(SELECT id FROM roles where name = 'student'));
INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'mc22002087'),(SELECT id FROM roles where name = 'student'));
INSERT INTO users_roles(usersid, rolesid)
VALUES ((SELECT id from users where username = 'mc220202348'),(SELECT id FROM roles where name = 'student'));
-- Permissions
INSERT INTO permissions (id , name, created_at , updated_at , parentID, action)
VALUES (UUID(),'user-manage' ,curdate(), curdate(),null,true);
INSERT INTO permissions (id , name, created_at , updated_at , parentID, action)
VALUES (UUID(),'users-list' ,curdate(), curdate(), (SELECT id FROM `permissions` as p where name='user-manage'),true);
INSERT INTO permissions (id , name, created_at , updated_at , parentID, action)
VALUES (UUID(),'users-add' ,curdate(), curdate(), (SELECT id FROM `permissions` as p where name='user-manage'),true);
INSERT INTO permissions (id , name, created_at , updated_at , parentID, action)
VALUES (UUID(),'users-delete' ,curdate(), curdate(), (SELECT id FROM `permissions` as p where name='user-manage'),true);
INSERT INTO permissions (id , name, created_at , updated_at , parentID, action)
VALUES (UUID(),'users-edit' ,curdate(), curdate(), (SELECT id FROM `permissions` as p where name='user-manage'),true);
INSERT INTO permissions (id , name, created_at , updated_at , parentID, action)
VALUES (UUID(),'roles-manage' ,curdate(), curdate(), null,true);
INSERT INTO permissions (id , name, created_at , updated_at ,  parentID, action)
VALUES (UUID(),'roles-list' ,curdate(), curdate(), (SELECT id FROM `permissions` as p where name='roles-manage'),true);
INSERT INTO permissions (id , name, created_at , updated_at ,  parentID, action)
VALUES (UUID(),'role-add' ,curdate(), curdate(), (SELECT id FROM `permissions` as p where name='roles-manage'),true);
INSERT INTO permissions (id , name, created_at , updated_at ,  parentID, action)
VALUES (UUID(),'role-delete' ,curdate(), curdate(),(SELECT id FROM `permissions` as p where name='roles-manage'),true);
INSERT INTO permissions (id , name, created_at , updated_at ,  parentID, action)
VALUES (UUID(),'role-edit' ,curdate(), curdate(), (SELECT id FROM `permissions` as p where name='roles-manage'),true);
INSERT INTO permissions (id , name, created_at , updated_at , parentID, action)
VALUES (UUID(),'permission-manage' ,curdate(), curdate(), null,true);
INSERT INTO permissions (id , name, created_at , updated_at , parentID, action)
VALUES (UUID(),'permission-list' ,curdate(), curdate(), (SELECT id FROM `permissions` as p where name='permission-manage'),true);
INSERT INTO permissions (id , name, created_at , updated_at ,parentID, action)
VALUES (UUID(),'permisssion-add' ,curdate(), curdate(), (SELECT id FROM `permissions` as p where name='permission-manage'),true);
INSERT INTO permissions (id , name, created_at , updated_at ,  parentID, action)
VALUES (UUID(),'permission-delete' ,curdate(), curdate(),(SELECT id FROM `permissions` as p where name='permission-manage'),true);
INSERT INTO permissions (id , name, created_at , updated_at ,parentID, action)
VALUES (UUID(),'permission-edit' ,curdate(), curdate(), (SELECT id FROM `permissions` as p where name='permission-manage'),true);

INSERT INTO roles_permissions(rolesId, permissionsId)
VALUES ((SELECT id from roles where name = 'admin'),(SELECT id FROM permissions where name = 'user-manage'));
INSERT INTO roles_permissions(rolesId, permissionsId)
VALUES ((SELECT id from roles where name = 'teacher'),(SELECT id FROM permissions where name = 'users-list'));
INSERT INTO roles_permissions(rolesId, permissionsId)
VALUES ((SELECT id from roles where name = 'student'),(SELECT id FROM permissions where name = 'users-add'));
INSERT INTO roles_permissions(rolesId, permissionsId)
VALUES ((SELECT id from roles where name = 'coordinator'),(SELECT id FROM permissions where name = 'users-delete'));
INSERT INTO roles_permissions(rolesId, permissionsId)
VALUES ((SELECT id from roles where name = 'incharge'),(SELECT id FROM permissions where name = 'users-edit'));

INSERT INTO users_permissions(usersId, permissionsId)
VALUES ((SELECT id from users where username = 'sawan'),(SELECT id FROM permissions where name = 'user-manage'));
INSERT INTO users_permissions(usersId, permissionsId)
VALUES ((SELECT id from users where username = 'wajahat'),(SELECT id FROM permissions where name = 'users-edit'));
INSERT INTO users_permissions(usersId, permissionsId)
VALUES ((SELECT id from users where username = 'student'),(SELECT id FROM permissions where name = 'users-delete'));
INSERT INTO users_permissions(usersId, permissionsId)
VALUES ((SELECT id from users where username = 'bc18040325'),(SELECT id FROM permissions where name = 'users-add'));

INSERT INTO degrees (id,title)
VALUES(UUID(),'BSCS');
INSERT INTO degrees (id,title)
VALUES(UUID(),'BSSE');
INSERT INTO degrees (id,title)
VALUES(UUID(),'BSIT');
INSERT INTO degrees (id,title)
VALUES(UUID(),'MIT');
INSERT INTO degrees (id,title)
VALUES(UUID(),'MCS');

INSERT INTO students ( id, userid, vuid, name, CNIC, phone,degreeId )
VALUES (uuid(),(SELECT id FROM users where email = 'student@vu.edu.pk'),(SELECT username as vuid FROM users WHERE username = 'student'),'Muhammad Mohsin','37871-8657561-7',93332855675,(SELECT id FROM degrees where title = 'BSCS'));
INSERT INTO students ( id, userid, vuid, name, CNIC, phone,degreeId )
VALUES (uuid(),(SELECT id FROM users where email = 'bc18040346@vu.edu.pk'),(SELECT username as vuid FROM users WHERE username = 'bc18040325'),'Ariba','37871-8657561-8',933328596745,(SELECT id FROM degrees where title = 'MIT'));
INSERT INTO students ( id, userid, vuid, name, CNIC, phone,degreeId )
VALUES (uuid(),(SELECT id FROM users where email = 'mc220202087jbi@vu.edu.pk'),(SELECT username as vuid FROM users WHERE username = 'mc220202087'),'HAMAD','37871-8657562-9',933328596345,(SELECT id FROM degrees where title = 'BSIT'));
INSERT INTO students ( id, userid, vuid, name, CNIC, phone,degreeId )
VALUES (uuid(),(SELECT id FROM users where email = 'mc220202346jbi@vu.edu.pk'),(SELECT username as vuid FROM users WHERE username = 'mc220202346'),'HAMAD','37871-8657561-9',933328593469,(SELECT id FROM degrees where title = 'BSSE'));
INSERT INTO students ( id, userid, vuid, name, CNIC, phone,degreeId )
VALUES 
		(uuid(),(SELECT id FROM users where email = 'bc140325601jbi@vu.edu.pk'),(SELECT username as vuid FROM users WHERE username = 'bc140325601'),'asim','37871-8657361-9',933368593469,(SELECT id FROM degrees where title = 'BSSE')),
    (uuid(),(SELECT id FROM users where email = 'bc140405608jbi@vu.edu.pk'),(SELECT username as vuid FROM users WHERE username = 'bc140405608'),'azeem','37871-8652561-9',933428593469,(SELECT id FROM degrees where title = 'BSSE'));






INSERT INTO subjects (id, code, title, is_active)
VALUES (uuid(),'CS201', 'INTRODUCTION TO Programming',DEFAULT);
INSERT INTO subjects (id, code, title, is_active)
VALUES (uuid(),'CS304', 'Object Oriented Programming',DEFAULT);
INSERT INTO subjects (id, code, title, is_active)
VALUES (uuid(),'CS403', 'Databases',DEFAULT);
INSERT INTO subjects (id, code, title, is_active)
VALUES (uuid(),'CS301', 'Data Structure',DEFAULT);
INSERT INTO subjects (id, code, title, is_active)
VALUES (uuid(),'CS502', 'Analysis and Design of Algorithm',DEFAULT);

 INSERT INTO degrees_subjects(degreesId, subjectsId)
 VALUES ((SELECT id from degrees where title = 'BSCS'),(SELECT id FROM subjects where title = 'INTRODUCTION TO PROGRAMMING'));
 INSERT INTO degrees_subjects(degreesId, subjectsId)
 VALUES ((SELECT id from degrees where title = 'BSCS'),(SELECT id FROM subjects where title = 'Object Oriented Programming'));
 INSERT INTO degrees_subjects(degreesId, subjectsId)
 VALUES ((SELECT id from degrees where title = 'BSCS'),(SELECT id FROM subjects where title = 'Databases'));
 INSERT INTO degrees_subjects(degreesId, subjectsId)
 VALUES ((SELECT id from degrees where title = 'BSCS'),(SELECT id FROM subjects where title = 'Data Structure'));
 INSERT INTO degrees_subjects(degreesId, subjectsId)
 VALUES ((SELECT id from degrees where title = 'BSCS'),(SELECT id FROM subjects where title = 'Analysis and Design of Algorithm'));

 INSERT INTO degrees_subjects(degreesId, subjectsId)
 VALUES ((SELECT id from degrees where title = 'BSIT'),(SELECT id FROM subjects where title = 'INTRODUCTION TO PROGRAMMING'));
 INSERT INTO degrees_subjects(degreesId, subjectsId)
 VALUES ((SELECT id from degrees where title = 'BSIT'),(SELECT id FROM subjects where title = 'Object Oriented Programming'));
 INSERT INTO degrees_subjects(degreesId, subjectsId)
 VALUES ((SELECT id from degrees where title = 'BSIT'),(SELECT id FROM subjects where title = 'Databases'));
 INSERT INTO degrees_subjects(degreesId, subjectsId)
 VALUES ((SELECT id from degrees where title = 'BSIT'),(SELECT id FROM subjects where title = 'Data Structure'));
 INSERT INTO degrees_subjects(degreesId, subjectsId)
 VALUES ((SELECT id from degrees where title = 'BSIT'),(SELECT id FROM subjects where title = 'Analysis and Design of Algorithm'));

 INSERT INTO degrees_subjects(degreesId, subjectsId)
 VALUES ((SELECT id from degrees where title = 'BSSE'),(SELECT id FROM subjects where title = 'INTRODUCTION TO PROGRAMMING'));
 INSERT INTO degrees_subjects(degreesId, subjectsId)
 VALUES ((SELECT id from degrees where title = 'BSSE'),(SELECT id FROM subjects where title = 'Object Oriented Programming'));
 INSERT INTO degrees_subjects(degreesId, subjectsId)
 VALUES ((SELECT id from degrees where title = 'BSSE'),(SELECT id FROM subjects where title = 'Databases'));
 INSERT INTO degrees_subjects(degreesId, subjectsId)
 VALUES ((SELECT id from degrees where title = 'BSSE'),(SELECT id FROM subjects where title = 'Data Structure'));
 INSERT INTO degrees_subjects(degreesId, subjectsId)
 VALUES ((SELECT id from degrees where title = 'BSSE'),(SELECT id FROM subjects where title = 'Analysis and Design of Algorithm'));

INSERT INTO degrees_subjects(degreesId, subjectsId)
VALUES ((SELECT id from degrees where title = 'MIT'),(SELECT id FROM subjects where title = 'INTRODUCTION TO PROGRAMMING'));
INSERT INTO degrees_subjects(degreesId, subjectsId)
VALUES ((SELECT id from degrees where title = 'MIT'),(SELECT id FROM subjects where title = 'Object Oriented Programming'));
INSERT INTO degrees_subjects(degreesId, subjectsId)
VALUES ((SELECT id from degrees where title = 'MIT'),(SELECT id FROM subjects where title = 'Databases'));
INSERT INTO degrees_subjects(degreesId, subjectsId)
VALUES ((SELECT id from degrees where title = 'MIT'),(SELECT id FROM subjects where title = 'Data Structure'));
INSERT INTO degrees_subjects(degreesId, subjectsId)
VALUES ((SELECT id from degrees where title = 'MIT'),(SELECT id FROM subjects where title = 'Analysis and Design of Algorithm'));

INSERT INTO degrees_subjects(degreesId, subjectsId)
VALUES ((SELECT id from degrees where title = 'MCS'),(SELECT id FROM subjects where title = 'INTRODUCTION TO PROGRAMMING'));
INSERT INTO degrees_subjects(degreesId, subjectsId)
VALUES ((SELECT id from degrees where title = 'MCS'),(SELECT id FROM subjects where title = 'Object Oriented Programming'));
INSERT INTO degrees_subjects(degreesId, subjectsId)
VALUES ((SELECT id from degrees where title = 'MCS'),(SELECT id FROM subjects where title = 'Databases'));
INSERT INTO degrees_subjects(degreesId, subjectsId)
VALUES ((SELECT id from degrees where title = 'MCS'),(SELECT id FROM subjects where title = 'Data Structure'));
INSERT INTO degrees_subjects(degreesId, subjectsId)
VALUES ((SELECT id from degrees where title = 'MCS'),(SELECT id FROM subjects where title = 'Analysis and Design of Algorithm'));

INSERT INTO SEMESTERS(ID, NAME, START_DATE, IS_ACTIVE )
VALUES(UUID(),'Spring 2015',CURDATE(), false);
INSERT INTO SEMESTERS(ID, NAME, START_DATE,  IS_ACTIVE)
VALUES(UUID(),'FALL 2015',CURDATE(), false);
INSERT INTO SEMESTERS(ID, NAME, START_DATE,  IS_ACTIVE)
VALUES(UUID(),'Spring 2016',CURDATE(), false);
INSERT INTO SEMESTERS(ID, NAME, START_DATE,  IS_ACTIVE)
VALUES(UUID(),'FALL 2016',CURDATE(), false);
INSERT INTO SEMESTERS(ID, NAME, START_DATE,  IS_ACTIVE)
VALUES(UUID(),'Spring 2017',CURDATE(), false);
INSERT INTO SEMESTERS(ID, NAME, START_DATE,  IS_ACTIVE)
VALUES(UUID(),'FALL 2017',CURDATE(), false);
INSERT INTO SEMESTERS(ID, NAME, START_DATE,  IS_ACTIVE)
VALUES(UUID(),'Spring 2018',CURDATE(), false);
INSERT INTO SEMESTERS(ID, NAME, START_DATE,  IS_ACTIVE)
VALUES(UUID(),'FALL 2018',CURDATE(), false);
INSERT INTO SEMESTERS(ID, NAME, START_DATE, IS_ACTIVE)
VALUES(UUID(),'Spring 2019',CURDATE(),false);
INSERT INTO SEMESTERS(ID, NAME, START_DATE,  IS_ACTIVE)
VALUES(UUID(),'FALL 2019',CURDATE(),false);
INSERT INTO SEMESTERS(ID, NAME, START_DATE,  IS_ACTIVE)
VALUES(UUID(),'Spring 2020',CURDATE(),false);
INSERT INTO SEMESTERS(ID, NAME, START_DATE,  IS_ACTIVE)
VALUES(UUID(),'FALL 2020',CURDATE(),false);
INSERT INTO SEMESTERS(ID, NAME, START_DATE,  IS_ACTIVE)
VALUES(UUID(),'Spring 2021',CURDATE(),false);
INSERT INTO SEMESTERS(ID, NAME, START_DATE , IS_ACTIVE)
VALUES(UUID(),'FALL 2021',CURDATE(),false);
INSERT INTO SEMESTERS(ID, NAME, START_DATE,  IS_ACTIVE)
VALUES(UUID(),'Spring 2022',CURDATE(),false);
INSERT INTO SEMESTERS(ID, NAME, START_DATE,  IS_ACTIVE)
VALUES(UUID(),'FALL 2022',CURDATE(),false);
INSERT INTO SEMESTERS(ID, NAME, START_DATE,  IS_ACTIVE)
VALUES(UUID(),'Spring 2023',CURDATE(),false);
INSERT INTO SEMESTERS(ID, NAME, START_DATE, IS_ACTIVE)
VALUES(UUID(),'FALL 2023',CURDATE(),false);
INSERT INTO SEMESTERS(ID, NAME, START_DATE,  IS_ACTIVE)
VALUES(UUID(),'Spring 2024',CURDATE(),true);

INSERT INTO batches(id, name, start_date, end_date,IS_SCREENED,IS_CURRENT,REGISTRATION_STATUS,startInSemesterId,endInSemesterId)
VALUES(UUID(),'Batch-1','2009-07-01','2010-07-01',DEFAULT,false,false,(select id as startInSemesterId from semesters where name='Spring 2009'),(select id as endInSemesterId from semesters where name='Fall 2009' ));
INSERT INTO batches(id, name, start_date, end_date,IS_SCREENED,IS_CURRENT,REGISTRATION_STATUS,startInSemesterId,endInSemesterId)
VALUES(UUID(),'Batch-2','2010-07-01','2011-07-01',DEFAULT,false,false,(select id as startInSemesterId from semesters where name='Fall 2009' ),(select id as endInSemesterId from semesters where name='Spring 2010' ));
INSERT INTO batches(id, name, start_date, end_date,IS_SCREENED,IS_CURRENT,REGISTRATION_STATUS,startInSemesterId,endInSemesterId)
VALUES(UUID(),'Batch-3','2011-07-01','2012-07-01',DEFAULT,false,false,(select id as startInSemesterId from semesters where name='Spring 2010' ),(select id as endInSemesterId from semesters where name='Fall 2010' ));
INSERT INTO batches(id, name, start_date, end_date,IS_SCREENED,IS_CURRENT,REGISTRATION_STATUS,startInSemesterId,endInSemesterId)
VALUES(UUID(),'Batch-4','2012-07-01','2013-07-01',DEFAULT,false,false,(select id as startInSemesterId from semesters where name='Fall 2010'),(select id as endInSemesterId from semesters where name='Spring 2011'));
INSERT INTO batches(id, name, start_date, end_date,IS_SCREENED,IS_CURRENT,REGISTRATION_STATUS,startInSemesterId,endInSemesterId)
VALUES(UUID(),'Batch-5','2013-07-01','2014-07-01',DEFAULT,false,false,(select id as startInSemesterId from semesters where name='Spring 2011'),(select id as endInSemesterId from semesters where name='Fall 2011'));
INSERT INTO batches(id, name, start_date, end_date,IS_SCREENED,IS_CURRENT,REGISTRATION_STATUS,startInSemesterId,endInSemesterId)
VALUES(UUID(),'Batch-6','2014-07-01','2015-07-01',DEFAULT,false,false,(select id as startInSemesterId from semesters where name='Fall 2011'),(select id as endInSemesterId from semesters where name='Spring 2012'));
INSERT INTO batches(id, name, start_date, end_date,IS_SCREENED,IS_CURRENT,REGISTRATION_STATUS,startInSemesterId,endInSemesterId)
VALUES(UUID(),'Batch-7','2015-07-01','2016-07-01',DEFAULT,false,false,(select id as startInSemesterId from semesters where name='Spring 2012'),(select id as endInSemesterId from semesters where name='Fall 2012'));
INSERT INTO batches(id, name, start_date, end_date,IS_SCREENED,IS_CURRENT,REGISTRATION_STATUS,startInSemesterId,endInSemesterId)
VALUES(UUID(),'Batch-8','2016-07-01','2017-07-01',DEFAULT,false,false,(select id as startInSemesterId from semesters where name='Fall 2012'),(select id as endInSemesterId from semesters where name='Spring 2013'));
INSERT INTO batches(id, name, start_date, end_date,IS_SCREENED,IS_CURRENT,REGISTRATION_STATUS,startInSemesterId,endInSemesterId)
VALUES(UUID(),'Batch-9','2017-07-01','2018-07-01',DEFAULT,false,false,(select id as startInSemesterId from semesters where name='Spring 2013'),(select id as endInSemesterId from semesters where name='Fall 2013'));
INSERT INTO batches(id, name, start_date, end_date,IS_SCREENED,IS_CURRENT,REGISTRATION_STATUS,startInSemesterId,endInSemesterId)
VALUES(UUID(),'Batch-10','2018-07-01','2019-07-01',DEFAULT,false,false,(select id as endInSemesterId from semesters where name='Fall 2013'),(select id as endInSemesterId from semesters where name='Fall 2013'));
INSERT INTO batches(id, name, start_date, end_date,IS_SCREENED,IS_CURRENT,REGISTRATION_STATUS,startInSemesterId,endInSemesterId)
VALUES(UUID(),'Batch-11','2019-07-01','2020-07-01',DEFAULT,false,false,(select id as startInSemesterId from semesters where name='Fall 2013'),(select id as endInSemesterId from semesters where name='Spring 2014'));
INSERT INTO batches(id, name, start_date, end_date,IS_SCREENED,IS_CURRENT,REGISTRATION_STATUS,startInSemesterId,endInSemesterId)
VALUES(UUID(),'Batch-12','2020-07-01','2021-07-01',DEFAULT,false,false,(select id as startInSemesterId from semesters where name='Spring 2014'),(select id as endInSemesterId from semesters where name='Fall 2014'));
INSERT INTO batches(id, name, start_date, end_date,IS_SCREENED,IS_CURRENT,REGISTRATION_STATUS,startInSemesterId,endInSemesterId)
VALUES(UUID(),'Batch-13','2021-07-01','2022-07-01',DEFAULT,false,false,(select id as startInSemesterId from semesters where name='Fall 2014'),(select id as endInSemesterId from semesters where name='Spring 2015'));
INSERT INTO batches(id, name, start_date, end_date,IS_SCREENED,IS_CURRENT,REGISTRATION_STATUS,startInSemesterId,endInSemesterId)
VALUES(UUID(),'Batch-14','2022-07-01','2023-07-01',DEFAULT,false,false,(select id as startInSemesterId from semesters where name='Spring 2015'),(select id as endInSemesterId from semesters where name='Fall 2015'));
INSERT INTO batches(id, name, start_date, end_date,IS_SCREENED,IS_CURRENT,REGISTRATION_STATUS,startInSemesterId,endInSemesterId)
VALUES(UUID(),'Batch-15','2023-07-01','2024-07-01',DEFAULT,false,false,(select id as startInSemesterId from semesters where name='Fall 2015'),(select id as endInSemesterId from semesters where name='Fall 2016'));
INSERT INTO batches(id, name, start_date, end_date,IS_SCREENED,IS_CURRENT,REGISTRATION_STATUS,startInSemesterId,endInSemesterId)
VALUES(UUID(),'Batch-16','2024-07-01','2025-07-01',DEFAULT,true,true,(select id as endInSemesterId from semesters where name='Fall 2016'),(select id as endInSemesterId from semesters where name='Spring 2017'));

INSERT INTO phases(id, name,SEQUENCE)
VALUES(UUID(),'Registered',1);
INSERT INTO phases(id, name,SEQUENCE)
VALUES(UUID(),'Shortlisted',2);
INSERT INTO phases(id, name,SEQUENCE)
VALUES(UUID(),'Rejected',3);
INSERT INTO phases(id, name,SEQUENCE)
VALUES(UUID(),'Assessment',4);
INSERT INTO phases(id, name,SEQUENCE)
VALUES(UUID(),'Absent',5);
INSERT INTO phases(id, name,SEQUENCE)
VALUES(UUID(),'Recommended',6);
INSERT INTO phases(id, name,SEQUENCE)
VALUES(UUID(),'Not Recommended',7);
INSERT INTO phases(id, name,SEQUENCE)
VALUES(UUID(),'Invited',8);
INSERT INTO phases(id, name,SEQUENCE)
VALUES(UUID(),'Joined',9);
INSERT INTO phases(id, name,SEQUENCE)
VALUES(UUID(),'Not Joined',10);
INSERT INTO phases(id, name,SEQUENCE)
VALUES(UUID(),'Quite',11);
INSERT INTO phases(id, name,SEQUENCE)
VALUES(UUID(),'Passout',12);

INSERT INTO cities (ID , name)
VALUES (UUID() , 'LAHORE');
INSERT INTO cities (ID , name)
VALUES (UUID() , 'Sargodha');
INSERT INTO cities (ID , name)
VALUES (UUID() , 'KARACHI');
INSERT INTO cities (ID , name)
VALUES (UUID() , 'Islamabad');
  INSERT INTO cities (ID , name)
 VALUES (UUID() , 'RAWALPINDY');
  INSERT INTO cities (ID , name)
 VALUES (UUID() , 'QUETTA');
  INSERT INTO cities (ID , name)
 VALUES (UUID() , 'PISHAWAR');
  INSERT INTO cities (ID , name)
 VALUES (UUID() , 'BAHAWALPUR');
  INSERT INTO cities (ID , name)
 VALUES (UUID() , 'MULTAN');
   INSERT INTO cities (ID , name)
 VALUES (UUID() , 'Dera Ghazi Khan');

INSERT INTO student_registrations(id,studentid,batchid, basecityid ,processedById, cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
VALUES (uuid(),(SELECT id from students where vuid = 'student'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'Islamabad'),(SELECT id as processedById  from users where fullname = 'Sarfraz Awan'),2.7,'\resumes\Fall2023-bc180403251.doc',CURDATE(),(SELECT id from phases where name = 'Registered'), CURDATE(),true, true);
INSERT INTO student_registrations(id,studentid,batchid, basecityid ,processedById, cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
VALUES (uuid(),(SELECT id from students where vuid = 'bc18040325'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'BAHAWALPUR'),(SELECT id as processedById  from users where fullname = 'Wajahat Hasshmi'),3.7,'\resumes\Fall2023-bc18040325.doc',CURDATE(),(SELECT id from phases where name = 'Registered'), CURDATE(),true, true );
INSERT INTO student_registrations(id,studentid,batchid, basecityid ,processedById, cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
VALUES (uuid(),(SELECT id from students where vuid = 'mc220202087'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'Dera Ghazi Khan'),(SELECT id as processedById  from users where fullname = 'Fareed'),3.8,'\resumes\Fall2023-bc18040325.doc',CURDATE(),(SELECT id from phases where name = 'Registered'),CURDATE(),true, true);
INSERT INTO student_registrations(id,studentid,batchid, basecityid ,processedById, cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
VALUES (uuid(),(SELECT id from students where vuid = 'mc220202346'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'LAHORE'),(SELECT id as processedById  from users where fullname = 'jawaria bibi'),3.9,'\resumes\Fall2023-bc18040325.doc',CURDATE(),(SELECT id from phases where name = 'Registered'), CURDATE(),true, true);

-- INSERT INTO student_registrations(id,studentid,batchid, basecityid ,processedById, cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES 
-- 		(uuid(),(SELECT id from students where vuid = 'bc140405608'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'Islamabad'),(SELECT id as processedById  from users where fullname = 'azeem'),2.7,'\resumes\Fall2023-bc180403251.doc',CURDATE(),(SELECT id from phases where name = 'shortlisted'), CURDATE(),true, true),
--         (uuid(),(SELECT id from students where vuid = 'bc140325601'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'Islamabad'),(SELECT id as processedById  from users where fullname = 'asim'),3.7,'\resumes\Fall2023-bc180403251.doc',CURDATE(),(SELECT id from phases where name = 'shortlisted'), CURDATE(),true, true);
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'student'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'Islamabad'),2.7,'\resumes\Fall2023-bc180403251.doc',CURDATE(),(SELECT id from phases where name = 'Rejected'), CURDATE(),true, true);
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'bc18040325'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'BAHAWALPUR'),3.7,'\resumes\Fall2023-bc18040325.doc',CURDATE(),(SELECT id from phases where name = 'Rejected'), CURDATE(),true, true );
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'mc220202087'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'Dera Ghazi Khan'),3.09,'\resumes\Fall2023-mc220202087.doc',CURDATE(),(SELECT id from phases where name = 'Rejected'), CURDATE(),true, true);
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'mc220202346'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'LAHORE'),4.00,'\resumes\Fall2023-mc220202346.doc',CURDATE(),(SELECT id from phases where name = 'Rejected'), CURDATE(),true, true);

-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'student'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'Islamabad'),2.7,'\resumes\Fall2023-bc180403251.doc',CURDATE(),(SELECT id from phases where name = 'Assessment'), CURDATE(),true, true);
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'bc18040325'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'BAHAWALPUR'),3.7,'\resumes\Fall2023-bc18040325.doc',CURDATE(),(SELECT id from phases where name = 'Assessment'), CURDATE(),true, true );
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'mc220202087'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'Dera Ghazi Khan'),3.09,'\resumes\Fall2023-mc220202087.doc',CURDATE(),(SELECT id from phases where name = 'Assessment'), CURDATE(),true, true);
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'mc220202346'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'LAHORE'),4.00,'\resumes\Fall2023-mc220202346.doc',CURDATE(),(SELECT id from phases where name = 'Assessment'), CURDATE(),true, true);

-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'student'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'Islamabad'),2.7,'\resumes\Fall2023-bc180403251.doc',CURDATE(),(SELECT id from phases where name = 'Absent'), CURDATE(),true, true);
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'bc18040325'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'BAHAWALPUR'),3.7,'\resumes\Fall2023-bc18040325.doc',CURDATE(),(SELECT id from phases where name = 'Absent'), CURDATE(),true, true );
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'mc220202087'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'Dera Ghazi Khan'),3.09,'\resumes\Fall2023-mc220202087.doc',CURDATE(),(SELECT id from phases where name = 'Absent'), CURDATE(),true, true);
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'mc220202346'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'LAHORE'),4.00,'\resumes\Fall2023-mc220202346.doc',CURDATE(),(SELECT id from phases where name = 'Absent'), CURDATE(),true, true);

-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'student'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'Islamabad'),2.7,'\resumes\Fall2023-bc180403251.doc',CURDATE(),(SELECT id from phases where name = 'Recommended'), CURDATE(),true, true);
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'bc18040325'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'BAHAWALPUR'),3.7,'\resumes\Fall2023-bc18040325.doc',CURDATE(),(SELECT id from phases where name = 'Recommended'), CURDATE(),true, true );
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'mc220202087'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'Dera Ghazi Khan'),3.09,'\resumes\Fall2023-mc220202087.doc',CURDATE(),(SELECT id from phases where name = 'Recommended'), CURDATE(),true, true);
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'mc220202346'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'LAHORE'),4.00,'\resumes\Fall2023-mc220202346.doc',CURDATE(),(SELECT id from phases where name = 'Recommended'), CURDATE(),true, true);

-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'student'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'Islamabad'),2.7,'\resumes\Fall2023-bc180403251.doc',CURDATE(),(SELECT id from phases where name = 'Not Recommended'), CURDATE(),true, true);
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'bc18040325'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'BAHAWALPUR'),3.7,'\resumes\Fall2023-bc18040325.doc',CURDATE(),(SELECT id from phases where name = 'Not Recommended'), CURDATE(),true, true );
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'mc220202087'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'Dera Ghazi Khan'),3.09,'\resumes\Fall2023-mc220202087.doc',CURDATE(),(SELECT id from phases where name = 'Not Recommended'), CURDATE(),true, true);
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'mc220202346'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'LAHORE'),4.00,'\resumes\Fall2023-mc220202346.doc',CURDATE(),(SELECT id from phases where name = 'Not Recommended'), CURDATE(),true, true);

-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'student'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'Islamabad'),2.7,'\resumes\Fall2023-bc180403251.doc',CURDATE(),(SELECT id from phases where name = 'Invited'), CURDATE(),true, true);
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'bc18040325'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'BAHAWALPUR'),3.7,'\resumes\Fall2023-bc18040325.doc',CURDATE(),(SELECT id from phases where name = 'Invited'), CURDATE(),true, true );
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'mc220202087'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'Dera Ghazi Khan'),3.09,'\resumes\Fall2023-mc220202087.doc',CURDATE(),(SELECT id from phases where name = 'Invited'), CURDATE(),true, true);
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'mc220202346'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'LAHORE'),4.00,'\resumes\Fall2023-mc220202346.doc',CURDATE(),(SELECT id from phases where name = 'Invited'), CURDATE(),true, true);

-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'student'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'Islamabad'),2.7,'\resumes\Fall2023-bc180403251.doc',CURDATE(),(SELECT id from phases where name = 'Joined'), CURDATE(),true, true);
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'bc18040325'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'BAHAWALPUR'),3.7,'\resumes\Fall2023-bc18040325.doc',CURDATE(),(SELECT id from phases where name = 'joined'), CURDATE(),true, true );
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'mc220202087'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'Dera Ghazi Khan'),3.09,'\resumes\Fall2023-mc220202087.doc',CURDATE(),(SELECT id from phases where name = 'joined'), CURDATE(),true, true);
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'mc220202346'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'LAHORE'),4.00,'\resumes\Fall2023-mc220202346.doc',CURDATE(),(SELECT id from phases where name = 'joined'), CURDATE(),true, true);

-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'student'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'Islamabad'),2.7,'\resumes\Fall2023-bc180403251.doc',CURDATE(),(SELECT id from phases where name = 'Not joined'), CURDATE(),true, true);
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'bc18040325'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'BAHAWALPUR'),3.7,'\resumes\Fall2023-bc18040325.doc',CURDATE(),(SELECT id from phases where name = 'Not joined'), CURDATE(),true, true );
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'mc220202087'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'Dera Ghazi Khan'),3.09,'\resumes\Fall2023-mc220202087.doc',CURDATE(),(SELECT id from phases where name = 'Not joined'), CURDATE(),true, true);
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'mc220202346'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'LAHORE'),4.00,'\resumes\Fall2023-mc220202346.doc',CURDATE(),(SELECT id from phases where name = 'Not joined'), CURDATE(),true, true);

-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'student'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'Islamabad'),2.7,'\resumes\Fall2023-bc180403251.doc',CURDATE(),(SELECT id from phases where name = 'Quite'), CURDATE(),true, true);
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'bc18040325'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'BAHAWALPUR'),3.7,'\resumes\Fall2023-bc18040325.doc',CURDATE(),(SELECT id from phases where name = 'Quite'), CURDATE(),true, true );
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'mc220202087'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'Dera Ghazi Khan'),3.09,'\resumes\Fall2023-mc220202087.doc',CURDATE(),(SELECT id from phases where name = 'Quite'), CURDATE(),true, true);
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'mc220202346'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'LAHORE'),4.00,'\resumes\Fall2023-mc220202346.doc',CURDATE(),(SELECT id from phases where name = 'Quite'), CURDATE(),true, true);

-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'student'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'Islamabad'),2.7,'\resumes\Fall2023-bc180403251.doc',CURDATE(),(SELECT id from phases where name = 'Passout'), CURDATE(),true, true);
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'bc18040325'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'BAHAWALPUR'),3.7,'\resumes\Fall2023-bc18040325.doc',CURDATE(),(SELECT id from phases where name = 'Passout'), CURDATE(),true, true );
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'mc220202087'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'Dera Ghazi Khan'),3.09,'\resumes\Fall2023-mc220202087.doc',CURDATE(),(SELECT id from phases where name = 'Passout'), CURDATE(),true, true);
-- INSERT INTO student_registrations(id,studentid,batchid, basecityid , cgpa , cv , created_at ,phaseId, processed_on, is_open,is_enrolled_project)
-- VALUES (uuid(),(SELECT id from students where vuid = 'mc220202346'),(SELECT id from batches where IS_CURRENT = true),(SELECT id as basecityid  from cities where name = 'LAHORE'),4.00,'\resumes\Fall2023-mc220202346.doc',CURDATE(),(SELECT id from phases where name = 'Passout'), CURDATE(),true, true);

INSERT INTO student_subjects (id, grade, subjectId, studentregistrationid)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS201'),(SELECT id FROM student_registrations where  studentid= (select id from students where vuid='student')));
INSERT INTO student_subjects (id, grade, subjectId, studentregistrationid)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS304'),(SELECT id FROM student_registrations where  studentid= (select id from students where vuid='student')));
INSERT INTO student_subjects (id, grade, subjectId, studentregistrationid)
VALUES (uuid(),'B+',(SELECT id from subjects where code = 'CS301'),(SELECT id FROM student_registrations where  studentid= (select id from students where vuid='student')));
INSERT INTO student_subjects (id, grade, subjectId, studentregistrationid)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS403'),(SELECT id FROM student_registrations where  studentid= (select id from students where vuid='student')));
INSERT INTO student_subjects (id, grade, subjectId, studentregistrationid)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS502'),(SELECT id FROM student_registrations where  studentid= (select id from students where vuid='student')));

INSERT INTO student_subjects (id, grade, subjectId, studentregistrationid)
VALUES (uuid(),'A+',(SELECT id from subjects where code = 'CS201'),(SELECT id FROM student_registrations where  studentid= (select id from students where vuid='mc220202346')));
INSERT INTO student_subjects (id, grade, subjectId, studentregistrationid)
VALUES (uuid(),'A',(SELECT id from subjects where code = 'CS304'),(SELECT id FROM student_registrations where  studentid= (select id from students where vuid='mc220202346')));
INSERT INTO student_subjects (id, grade, subjectId, studentregistrationid)
VALUES (uuid(),'A-',(SELECT id from subjects where code = 'CS301'),(SELECT id FROM student_registrations where  studentid= (select id from students where vuid='mc220202346')));
INSERT INTO student_subjects (id, grade, subjectId, studentregistrationid)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS403'),(SELECT id FROM student_registrations where  studentid= (select id from students where vuid='mc220202346')));
INSERT INTO student_subjects (id, grade, subjectId, studentregistrationid)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS502'),(SELECT id FROM student_registrations where  studentid= (select id from students where vuid='mc220202346')));

INSERT INTO student_subjects (id, grade, subjectId, studentregistrationid)
VALUES (uuid(),'A',(SELECT id from subjects where code = 'CS201'),(SELECT id FROM student_registrations where  studentid= (select id from students where vuid='mc220202087')));
INSERT INTO student_subjects (id, grade, subjectId, studentregistrationid)
VALUES (uuid(),'C',(SELECT id from subjects where code = 'CS304'),(SELECT id FROM student_registrations where  studentid= (select id from students where vuid='mc220202087')));
INSERT INTO student_subjects (id, grade, subjectId, studentregistrationid)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS301'),(SELECT id FROM student_registrations where  studentid= (select id from students where vuid='mc220202087')));
INSERT INTO student_subjects (id, grade, subjectId, studentregistrationid)
VALUES (uuid(),'D',(SELECT id from subjects where code = 'CS403'),(SELECT id FROM student_registrations where  studentid= (select id from students where vuid='mc220202087')));
INSERT INTO student_subjects (id, grade, subjectId, studentregistrationid)
VALUES (uuid(),'C',(SELECT id from subjects where code = 'CS502'),(SELECT id FROM student_registrations where  studentid= (select id from students where vuid='mc220202087')));

INSERT INTO student_subjects (id, grade, subjectId, studentregistrationid)
VALUES (uuid(),'A',(SELECT id from subjects where code = 'CS201'),(SELECT id FROM student_registrations where  studentid= (select id from students where vuid='bc18040325')));
INSERT INTO student_subjects (id, grade, subjectId, studentregistrationid)
VALUES (uuid(),'C',(SELECT id from subjects where code = 'CS304'),(SELECT id FROM student_registrations where  studentid= (select id from students where vuid='bc18040325')));
INSERT INTO student_subjects (id, grade, subjectId, studentregistrationid)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS301'),(SELECT id FROM student_registrations where  studentid= (select id from students where vuid='bc18040325')));
INSERT INTO student_subjects (id, grade, subjectId, studentregistrationid)
VALUES (uuid(),'D',(SELECT id from subjects where code = 'CS403'),(SELECT id FROM student_registrations where  studentid= (select id from students where vuid='bc18040325')));
INSERT INTO student_subjects (id, grade, subjectId, studentregistrationid)
VALUES (uuid(),'C',(SELECT id from subjects where code = 'CS502'),(SELECT id FROM student_registrations where  studentid= (select id from students where vuid='bc18040325')));

INSERT INTO eligibility_criterias( id, minimum_cgpa , project_enrollment, include_grades ,degreeid , batchid)
VALUES(UUID(),2.6,true,true,(SELECT id from degrees where title = 'BSCS'),(SELECT id from batches where name = 'Batch-16'));
INSERT INTO eligibility_criterias( id, minimum_cgpa , project_enrollment, include_grades ,degreeid , batchid)
VALUES(UUID(),2.6,true,true,(SELECT id from degrees where title = 'BSSE'),(SELECT id from batches where name = 'Batch-16'));
INSERT INTO eligibility_criterias( id, minimum_cgpa , project_enrollment, include_grades ,degreeid , batchid)
VALUES(UUID(),2.6,true,true,(SELECT id from degrees where title = 'BSIT'),(SELECT id from batches where name = 'Batch-16'));
INSERT INTO eligibility_criterias( id, minimum_cgpa , project_enrollment, include_grades ,degreeid , batchid)
VALUES(UUID(),2.6,true,true,(SELECT id from degrees where title = 'MCS'),(SELECT id from batches where name = 'Batch-16'));
INSERT INTO eligibility_criterias( id, minimum_cgpa , project_enrollment, include_grades ,degreeid , batchid)
VALUES(UUID(),2.6,true,true,(SELECT id from degrees where title = 'MIT'),(SELECT id from batches where name = 'Batch-16'));

INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS201'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='BSCS')));
INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS301'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='BSCS')));
INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS403'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='BSCS')));
INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS502'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='BSCS')));
INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS304'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='BSCS')));


INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS201'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='BSSE')));
INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS301'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='BSSE')));
INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS403'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='BSSE')));
INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS502'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='BSSE')));
INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS304'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='BSSE')));

INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS201'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='BSIT')));
INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS301'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='BSIT')));
INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS403'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='BSIT')));
INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS502'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='BSIT')));
INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS304'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='BSIT')));

INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS201'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='MIT')));
INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS301'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='MIT')));
INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS403'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='MIT')));
INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS502'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='MIT')));
INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS304'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='MIT')));

INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS201'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='MCS')));
INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS301'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='MCS')));
INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS403'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='MCS')));
INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS502'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='MCS')));
INSERT INTO eligibility_criteria_subjects (id, grade, subjectsId, eligibilitycriteriaId)
VALUES (uuid(),'B',(SELECT id from subjects where code = 'CS304'),(SELECT id FROM eligibility_criterias where degreeId = (select id from degrees where title='MCS')));

INSERT INTO phase_histories( id, processed_on , comments, studentRegistrationId ,phasesId , processedById)
VALUES(UUID(),CURDATE(),"this student succesfull Registered",(SELECT id from student_registrations where studentid = (select id from students where vuid = 'student')),(SELECT id from phases where name = 'Registered'),(SELECT id from users where email = 'student@vu.edu.pk'));
INSERT INTO phase_histories( id, processed_on , comments, studentRegistrationId ,phasesId , processedById)
VALUES(UUID(),CURDATE(),"you are Shortlisted student",(SELECT id from student_registrations where studentid = (select id from students where vuid = 'student')),(SELECT id from phases where name = 'Shortlisted'),(SELECT id from users where email = 'student@vu.edu.pk'));
INSERT INTO phase_histories( id, processed_on , comments, studentRegistrationId ,phasesId , processedById)
VALUES(UUID(),CURDATE(),"your Assessment completed ",(SELECT id from student_registrations where studentid = (select id from students where vuid = 'student')),(SELECT id from phases where name = 'Assessment'),(SELECT id from users where email = 'student@vu.edu.pk'));
INSERT INTO phase_histories( id, processed_on , comments, studentRegistrationId ,phasesId , processedById)
VALUES(UUID(),CURDATE(),"your are selected for interview",(SELECT id from student_registrations where studentid = (select id from students where vuid = 'student')),(SELECT id from phases where name = 'Recommended'),(SELECT id from users where email = 'student@vu.edu.pk'));
INSERT INTO phase_histories( id, processed_on , comments, studentRegistrationId ,phasesId , processedById)
VALUES(UUID(),CURDATE(),"you are selected to join internship at vu software house",(SELECT id from student_registrations where studentid = (select id from students where vuid = 'student')),(SELECT id from phases where name = 'Registered'),(SELECT id from users where email = 'student@vu.edu.pk'));
INSERT INTO phase_histories( id, processed_on , comments, studentRegistrationId ,phasesId , processedById)
VALUES(UUID(),CURDATE(),"congratulation you are part of vush",(SELECT id from student_registrations where studentid = (select id from students where vuid = 'student')),(SELECT id from phases where name = 'Invited'),(SELECT id from users where email = 'student@vu.edu.pk'));
INSERT INTO phase_histories( id, processed_on , comments, studentRegistrationId ,phasesId , processedById)
VALUES(UUID(),CURDATE(),"congratulation you are succesfully complete your internship at vush best wishes for your future",(SELECT id from student_registrations where studentid = (select id from students where vuid = 'student')),(SELECT id from phases where name = 'Registered'),(SELECT id from users where email = 'student@vu.edu.pk'));

INSERT INTO grades (id,grade)
VALUES(uuid(),'A+');
INSERT INTO grades (id,grade)
VALUES(uuid(),'A');
INSERT INTO grades (id,grade)
VALUES(uuid(),'A-');
INSERT INTO grades (id,grade)
VALUES(uuid(),'B+');
INSERT INTO grades (id,grade)
VALUES(uuid(),'B');
INSERT INTO grades (id,grade)
VALUES(uuid(),'B-');
INSERT INTO grades (id,grade)
VALUES(uuid(),'C');
INSERT INTO grades (id,grade)
VALUES(uuid(),'D');



INSERT INTO assessments (
  id,
  studentRegistrationId,
  testWeightageId,
  batchid,
  test_obtain_marks,
  test_obtain_weightage,
  test_comment,
  interview_obtain_marks, 
  interview_obtain_weightage, 
  interview_comment,
  total_obtain_marks,
  total_obtain_weightage )
VALUES(uuid(),
(select id from student_registrations where cgpa = 2.70),
(select id from test_weightages where test_weightage = 25),
(select id from batches where is_current = true),
30, 15,"good",46, 23,"exclent",76,45
);
INSERT INTO assessments (
  id,
  studentRegistrationId,
  testWeightageId,
  batchid,
  test_obtain_marks,
  test_obtain_weightage,
  test_comment,
  interview_obtain_marks, 
  interview_obtain_weightage, 
  interview_comment,
  total_obtain_marks,
  total_obtain_weightage)
VALUES(uuid(),
(select id from student_registrations where cgpa = 4.00),
(select id from test_weightages where test_weightage = 70),
(select id from batches where is_current = true),
30, 15,"good", 46, 23,"exclent",76,37
);
INSERT INTO assessments (
  id,
  studentRegistrationId,
  testWeightageId,
  batchid,
  test_obtain_marks,
  test_obtain_weightage,
  test_comment, 
  interview_obtain_marks, 
  interview_obtain_weightage, 
  interview_comment,
  total_obtain_marks,
  total_obtain_weightage)
VALUES(uuid(),
(select id from student_registrations where cgpa = 3.70),
(select id from test_weightages where test_weightage = 40),
(select id from batches where is_current = true),
30, 15,"good", 46, 23,"exclent",76,36
);
INSERT INTO assessments (
  id,
  studentRegistrationId,
  testWeightageId,
  batchid,
  test_obtain_marks,
  test_obtain_weightage,
  test_comment, 
  interview_obtain_marks, 
  interview_obtain_weightage, 
  interview_comment,
  total_obtain_marks,
  total_obtain_weightage)
VALUES(uuid(),
(select id from student_registrations where cgpa = 3.09),
(select id from test_weightages where test_weightage = 50),
(select id from batches where is_current = true),
30, 46,"very good",40, 23,"exclent",76,46
);

INSERT INTO test_weightages (id,batchid,test_weightage,interview_weightage ,total_weightage, test_total_marks, interview_total_marks, total_marks)
VALUES(uuid(),(select id from batches where is_current = true),25,75,100,25,75,100);
-- INSERT INTO test_weightages (id,batchid,test_weightage,interview_weightage ,total_weightage, test_total_marks, interview_total_marks, total_marks)
-- VALUES(uuid(),(select id from batches where is_current = true),40,60,100,25,75,100);
-- INSERT INTO test_weightages (id,batchid,test_weightage,interview_weightage ,total_weightage, test_total_marks, interview_total_marks, total_marks)
-- VALUES(uuid(),(select id from batches where is_current = true),50,50,100,25,75,100);
-- INSERT INTO test_weightages (id,batchid,test_weightage,interview_weightage ,total_weightage, test_total_marks, interview_total_marks, total_marks)
-- VALUES(uuid(),(select id from batches where is_current = true),70,30,100,25,75,100);