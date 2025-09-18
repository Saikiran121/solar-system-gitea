pipeline {
    agent any 

    tools {
        nodejs 'NodeJS-22-6-0'
    }

    environment {
        MONGO_URI = "mongodb+srv://saikiranbiradar76642_db_user:REDACTED@cluster0.sghaem5.mongodb.net/superData?retryWrites=true&w=majority"
        MONGO_DB_CREDS = credentials('mongo-db-credentials')
        MONGO_USERNAME = credentials('mongo-db-username')
        MONGO_PASSWORD = credentials('mongo-db-password')
        SONAR_SCANNER_HOME = tool 'sonarqube-scanner'
    }

    stages {
        stage('Installing Dependencies') {
            steps {
                sh 'npm install --no-audit'
            }
        }

        stage('dependency Scanning') {
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
                            --disableYarnAudit
                            --prettyPrint
                        ''',
                        odcInstallation: 'OWASP-DepCheck-12'

                        dependencyCheckPublisher failedTotalCritical: 1, pattern: '**/dependency-check-report/dependency-check-report.xml', stopBuild: true

                        junit allowEmptyResults: true, stdioRetention: '', testResults: './dependency-check-report/dependency-check-junit.xml'

                        publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, icon: '', keepAll: true, reportDir: './dependency-check-report/', reportFiles: 'dependency-check-jenkins.html', reportName: 'Dependency Check HTML Report', reportTitles: '', useWrapperFileDirectly: true])
                    }
                }

                stage('Unit Testing') {
                    steps {
                        sh '''
                            echo Colon-Separated - $MONGO_DB_CREDS
                            echo Username - $MONGO_DB_CREDS_USR
                            echo Password - $MONGO_DB_CREDS_PSW
                            ATLAS_HOST="cluster0.sghaem5.mongodb.net"
                            DBNAME="superData"
                            export MONGO_URI="mongodb+srv://${MONGO_DB_CREDS_USR}:${MONGO_DB_CREDS_PSW}@${ATLAS_HOST}/${DBNAME}?retryWrites=true&w=majority"
                            npm test 
                        '''
                        junit allowEmptyResults: true, stdioRetention: '', testResults: 'test-results.xml'
                    }
                }

                stage('Code Coverage') {
                    steps {
                        catchError(buildResult: 'SUCCESS', message: 'It will be fixed in future releases', stageResult: 'UNSTABLE') {
                            sh 'npm run coverage'
                        }
                        
                        stash name: 'coverage', includes: 'coverage/**', allowEmpty: true
                        publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, icon: '', keepAll: true, reportDir: './coverage/lcov-report/', reportFiles: 'index.html', reportName: 'Code Coverage HTML Report', reportTitles: '', useWrapperFileDirectly: true])
                    }
                }
            }
        }

        
        stage('SAST - SonarQube') {
            steps {
                timeout(time: 240, unit: 'SECONDS') {
                    unstash 'coverage' 
                    sh 'echo "workspace: $(pwd)"; ls -la || true; ls -la coverage || true; [ -f coverage/lcov.info ] && echo "lcov present" || echo "lcov MISSING"'

                    withSonarQubeEnv('sonar-qube-token') {
                        sh '''
                            $SONAR_SCANNER_HOME/bin/sonar-scanner \
                              -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                              -Dsonar.sources=app.js \
                              -Dsonar.projectKey=UI-Improvement
                        '''
                    }
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t saikiran8050/ui-improvement:$GIT_COMMIT .'
            }
        }

        stage("Trivy Vulnerability Scanning") {
            steps {
                sh '''
                    trivy image saikiran8050/ui-improvement:$GIT_COMMIT \
                        --severity LOW,MEDIUM \
                        --exit-code 0 \
                        --quiet \
                        --format json -o trivy-image-MEDIUM-results.json
                    
                    trivy image saikiran8050/ui-improvement:$GIT_COMMIT \
                        --severity CRITICAL \
                        --exit-code 1 \
                        --quiet \
                        --format json -o trivy-image-CRITICAL-results.json
                '''
            }

            post {
                always {
                    sh '''
                        trivy convert \
                        --format template --template "@/usr/local/share/trivy/templates/html.tpl" \
                        --output trivy-image-MEDIUM-results.html trivy-image-MEDIUM-results.json

                        trivy convert \
                        --format template --template "@/usr/local/share/trivy/templates/html.tpl" \
                        --output trivy-image-CRITICAL-results.html trivy-image-CRITICAL-results.json

                        trivy convert \
                        --format template --template "@/usr/local/share/trivy/templates/junit.tpl" \
                        --output trivy-image-MEDIUM-results.xml trivy-image-MEDIUM-results.json

                        trivy convert \
                        --format template --template "@/usr/local/share/trivy/templates/junit.tpl" \
                        --output trivy-image-CRITICAL-results.xml trivy-image-CRITICAL-results.json
                    '''

                }
            }
        }
    } 

    post {
        always {
                junit allowEmptyResults: true, stdioRetention: '', testResults: 'test-results.xml'
                junit allowEmptyResults: true, stdioRetention: '', testResults: './dependency-check-report/dependency-check-junit.xml'

                publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, icon: '', keepAll: true, reportDir: './dependency-check-report/', reportFiles: 'dependency-check-jenkins.html', reportName: 'Dependency Check HTML Report', reportTitles: '', useWrapperFileDirectly: true])

                publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, icon: '', keepAll: true, reportDir: './coverage/lcov-report/', reportFiles: 'index.html', reportName: 'Code Coverage HTML Report', reportTitles: '', useWrapperFileDirectly: true])
        }
    }
}

