-- 07/07/2022

CREATE TABLE IF NOT EXISTS productImages (
					imageId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                    productId INT,
                    path VARCHAR(255),
                    FOREIGN KEY (productId) REFERENCES products (productId)
				);