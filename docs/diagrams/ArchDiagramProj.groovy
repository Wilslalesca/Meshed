workspace "Name" "Description" {

    !identifiers hierarchical

    model {
        //users
        athlete = person "Student-Athlete"
        coach = person "Coach"
        facilitymng = person "Facility Administrator"
        
        //main system
        meshed = softwareSystem "Meshed" "Optimized Facility and Practice Scheduling Software" {
            tags "Meshed"
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
        athlete -> meshed "Uses"
        athlete -> meshed.wa "Visits"
        coach -> meshed "Uses"
        coach -> meshed.wa "Visits"
        facilitymng -> meshed "Uses"
        facilitymng -> meshed.wa "Visits"
        
        //supporting software systems
        meshed -> notificationGateway "Send athlete schedule update notifications"
        
        //containers
        meshed.wa -> meshed.api "Communicates to"
        meshed.api -> meshed.appServer "Sends logic to compute"
        meshed.wa -> meshed.appServer "Sends authentication logic to"
        meshed.appServer -> meshed.db "Reads from and writes to"
        
        //appserver comp
        meshed.wa -> meshed.api.auth "Manages logins and authentication"
        meshed.wa -> meshed.api.mng "Provides way to manage account settings"
        meshed.wa -> meshed.api.courseUploadReq "Recieves requests for uploading course information"
        meshed.wa -> meshed.api.facilityReq "Recieves requests for facility bookings"
        meshed.wa -> meshed.api.optiReq "Recieves requests for optimization generation requests"
        meshed.wa -> meshed.appServer.facility "Handles facility booking creation"
        meshed.wa -> meshed.appServer.optimize "Handles schedule optimization Generation"
        meshed.wa -> meshed.appServer.notif "Manages notifcations and authentication"
        meshed.wa -> meshed.appServer.upload "Manages course saving"

        
    }

    views {
        systemContext meshed "ContextDiagram" {
            include *
            autolayout lr
        }
        
        container meshed "ContainerDiagram" {
            include *
            autolayout lr
        }
        
        component meshed.appServer "ApplicationServerComponent" {
            include *
            autolayout lr
        }
        component meshed.api "APIComponent" {
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
            element "Meshed" {
                background #900C3F
                border solid
            }

        }
    }

    configuration {
        scope softwaresystem
    }

}
