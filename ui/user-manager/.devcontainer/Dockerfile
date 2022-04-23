FROM mcr.microsoft.com/vscode/devcontainers/base:hirsute
SHELL ["/bin/bash", "-c"] 
RUN sudo apt-get update && \
    sudo apt-get upgrade -y && \
    sudo apt-get install -y awscli build-essential && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash && \
    export NVM_DIR="/root/.nvm" && \
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" && \
    nvm install 16.3.0 && \
    nvm install-latest-npm 
