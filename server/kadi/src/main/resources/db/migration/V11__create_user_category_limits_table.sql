CREATE TABLE user_category_limits (
    user_id UUID NOT NULL,
    category_id BIGINT NOT NULL,
    limit_amount BIGINT NOT NULL,
    PRIMARY KEY (user_id, category_id),
    CONSTRAINT fk_user_category_limits_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_user_category_limits_category FOREIGN KEY (category_id) REFERENCES categories(id)
);
