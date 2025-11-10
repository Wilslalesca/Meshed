workspace "Name" "Description" {

    !identifiers hierarchical

    model {
        //users
        athlete = person "Student-Athlete"
        coach = person "Coach"
        facilitymng = person "Facility Administrator"
        
        //main system
        uma = softwareSystem "UMA" "Optimized Facility and Practice Scheduling Software" {
            tags "UMA"
            //containers
            db = container "Database Schema" "PostgreSQL"{
                tags "Database"
            }
            wa = container "Web Application" "React JS"
            //components
            api = container "API Gateway" "TypeScript"{
                courseUploadReq = component "Course Upload Requests"
                facilityReq = component "Facility Requests"
                optiReq = component "Optimize Schedule Requests"
                auth = component "User Authentication"
                mng = component "Account Management and Registration"
            }
            
            //components
            appServer = container "Application Server" "Google Cloud"{
                upload = component "Upload Course Processing"
                facility = component "Facility Booking Processing"
                optimize = component "Optimized Schedule Processing"
                notif = component "Notification Service"
            }
        }
        
        notificationGateway = softwareSystem "Notification Gateway" "SMS/Email reminders"{
            tags "External"
        }
        
        //people
        athlete -> uma "Uses"
        athlete -> uma.wa "Visits"
        coach -> uma "Uses"
        coach -> uma.wa "Visits"
        facilitymng -> uma "Uses"
        facilitymng -> uma.wa "Visits"
        
        //supporting software systems
        uma -> notificationGateway "Send parking spot availability notifications"
        
        //containers
        uma.wa -> uma.api "Communicates to"
        uma.api -> uma.appServer "Sends logic to compute"
        uma.wa -> uma.appServer "Sends authentication logic to"
        uma.appServer -> uma.db "Reads from and writes to"
        
        //appserver comp
        uma.wa -> uma.api.auth "Manages logins and authentication"
        uma.wa -> uma.api.mng "Provides way to manage account settings"
        uma.wa -> uma.api.courseUploadReq "Recieves requests for uploading course information"
        uma.wa -> uma.api.facilityReq "Recieves requests for facility bookings"
        uma.wa -> uma.api.optiReq "Recieves requests for optimization generation requests"
        uma.wa -> uma.appServer.facility "Handles facility booking creation"
        uma.wa -> uma.appServer.optimize "Handles schedule optimization Generation"
        uma.wa -> uma.appServer.notif "Manages notifcations and authentication"
        uma.wa -> uma.appServer.upload "Manages course saving"

        
    }

    views {
        systemContext uma "ContextDiagram" {
            include *
            autolayout lr
        }
        
        container uma "ContainerDiagram" {
            include *
            autolayout lr
        }
        
        component uma.appServer "ApplicationServerComponent" {
            include *
            autolayout lr
        }
        component uma.api "APIComponent" {
            include *
            autolayout lr
        }

        styles {
            element "Element" {
                color #ffffff
            }
            element "Person" {
                background #FF5733
                shape person
            }
            element "Container" {
                background #FFC300
            }
            element "Component" {
                background #FF7F50
            }
            element "Database" {
                shape cylinder
            }
            element "External" {
                background #C70039
                color #ffffff       
                border dashed
            }
            element "UMA" {
                background #900C3F
                border solid
            }

        }
    }

    configuration {
        scope softwaresystem
    }

}
