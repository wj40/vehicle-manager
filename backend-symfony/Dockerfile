FROM php:8.5.8-apache AS base



# COPY composer.json composer.lock ./

RUN apt-get update && apt-get install -y \
    libzip-dev \
    libonig-dev \
    libicu-dev \
    && docker-php-ext-install mbstring pdo_mysql intl zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*


# COPY bin ./bin
# COPY config ./config
# COPY migrations ./migrations
# COPY public ./public
# COPY src ./src
# COPY .env .env


# COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer
# RUN composer install --no-scripts --no-interaction

# RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
#     && sed -i 's/^variables_order.*/variables_order = "EGPCS"/' "$PHP_INI_DIR/php.ini"
WORKDIR /var/www/html
RUN mkdir -p var/cache var/log && chown -R www-data:www-data var

RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh


ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-foreground"]

FROM base AS dev

RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini" \
    && sed -i 's/^variables_order.*/variables_order = "EGPCS"/' "$PHP_INI_DIR/php.ini"

COPY composer.json composer.lock ./
COPY bin ./bin
COPY migrations ./migrations
RUN touch .env

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer
RUN composer install --no-scripts --no-interaction

FROM base AS prod

RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
    && sed -i 's/^variables_order.*/variables_order = "EGPCS"/' "$PHP_INI_DIR/php.ini"

COPY composer.json composer.lock ./
COPY bin ./bin
COPY config ./config
COPY migrations ./migrations
COPY public ./public
COPY src ./src
# COPY .env .env
RUN touch .env

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts
RUN rm /usr/local/bin/composer