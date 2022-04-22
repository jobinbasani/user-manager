FROM mcr.microsoft.com/vscode/devcontainers/base:hirsute
RUN sudo apt-get update && \
    sudo apt-get upgrade -y && \
    sudo apt-get install -y build-essential awscli && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash && \
    . /root/.bashrc && \
    nvm install 16.3.0 && \
    nvm install-latest-npm

