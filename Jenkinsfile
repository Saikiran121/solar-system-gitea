pipeline {
    agent any 

    tools {
        nodejs 'NodeJS-22-6-0'
    }
    stages {
        stage('Installing Dependencies') {
            steps {
                sh 'npm install --no-audit'
            }
        }
    }
}

