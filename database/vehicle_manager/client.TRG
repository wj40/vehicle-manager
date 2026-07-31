TYPE=TRIGGERS
triggers='CREATE DEFINER=`root`@`localhost` TRIGGER before_insert_client\nBEFORE INSERT ON client\nFOR EACH ROW\nBEGIN\n    DECLARE prefix VARCHAR(6);\n    DECLARE last_cid VARCHAR(20);\n    DECLARE next_num INT;\n\n    SET prefix = DATE_FORMAT(NOW(), \'%Y%m\');\n    SELECT MAX(cid) INTO last_cid FROM client WHERE cid LIKE CONCAT(prefix, \'%\');\n\n    IF last_cid IS NULL THEN\n        SET next_num = 1;\n    ELSE\n        SET next_num = CAST(SUBSTRING(last_cid, 7) AS UNSIGNED) + 1;\n    END IF;\n\n    SET NEW.cid = CONCAT(prefix, LPAD(next_num, 4, \'0\'));\nEND'
sql_modes=1411383296
definers='root@localhost'
client_cs_names='utf8mb4'
connection_cl_names='utf8mb4_uca1400_ai_ci'
db_cl_names='utf8mb4_uca1400_ai_ci'
created=1785484850444529
