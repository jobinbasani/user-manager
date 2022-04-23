FROM mcr.microsoft.com/vscode/devcontainers/base:hirsute
SHELL ["/bin/bash", "-c"] 
RUN sudo apt-get update && \
    sudo apt-get upgrade -y && \
    sudo apt-get install -y awscli curl git mercurial make binutils bison gcc golang-go build-essential && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash && \
    export NVM_DIR="/root/.nvm" && \
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" && \
    nvm install 16.3.0 && \
    nvm install-latest-npm && \
    curl -s -S -L https://raw.githubusercontent.com/moovweb/gvm/master/binscripts/gvm-installer | bash && \
    source /root/.gvm/scripts/gvm && \
    gvm install go1.18 && \
    apt-get remove -y golang-go && \
    apt-get autoremove -y && \
    ln -s /root/.gvm/gos/go1.18/bin/go /usr/bin/go && \
    ln -s /root/.gvm/gos/go1.18/bin/gofmt /usr/bin/gofmt && \
    go install -v github.com/ramya-rao-a/go-outline@latest && \
    go install -v golang.org/x/tools/gopls@latest && \
    go install github.com/golangci/golangci-lint/cmd/golangci-lint@v1.45.2 && \
    go install github.com/go-delve/delve/cmd/dlv@latest && \
    go install honnef.co/go/tools/cmd/staticcheck@latest

