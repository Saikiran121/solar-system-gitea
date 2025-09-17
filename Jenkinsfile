pipeline {
    agent any 

    tools {
        nodejs 'NodeJS-22-6-0'
    }
    stages {
        stage('Node version') {
            steps {
                sh '''
                    node -v
                    npm -v
                '''
            }
        }
    }
}

