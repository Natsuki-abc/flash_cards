FROM php:8.1-fpm

ARG USER_ID
ARG GROUP_ID

# 必要なパッケージのインストール
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev

# PHP 拡張機能のインストール
RUN docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd

# Composer のインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 作業ディレクトリの作成
WORKDIR /var/www

# ホストマシンのユーザーIDとグループIDを使用してユーザーを作成
RUN if [ ${USER_ID:-0} -ne 0 ] && [ ${GROUP_ID:-0} -ne 0 ]; then \
    groupadd -g ${GROUP_ID} laravel && \
    useradd -u ${USER_ID} -g laravel -m -s /bin/bash laravel \
;fi

# ユーザー権限の設定
RUN chown -R www-data:www-data /var/www

# コマンド実行ユーザーの設定
USER ${USER_ID:-0}:${GROUP_ID:-0}

EXPOSE 9000
CMD ["php-fpm"]
