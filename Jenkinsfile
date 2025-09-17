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

        stage("dependency Scanning") {
            parallel {
                stage('NPM Dependency Audit') {
                    steps {
                        sh '''
                            npm audit --audit-level=critical
                            echo $?
                        '''
                    }
                }

                stage('OWASP Dependency Check') {
                    steps {
                        dependencyCheck additionalArguments: '''
                            --scan .
                            --out ./dependency-check-report
                            --format ALL
                            --prettyPrint
                        ''',
                        odcInstallation: 'OWASP-DepCheck-12'

                        dependencyCheckPublisher failedTotalCritical: 1, pattern: '**/dependency-check-report/dependency-check-report.xml', stopBuild: true
                    }
                }
            }
        }
        
    }
}

