workspace "Name" "Description" {

    !identifiers hierarchical

    model {
        //users
        customer = person "Customer"
        parkingStaff = person "Parking Staff"
        
        //main system
        smartPark = softwareSystem "SmartPark" "Online Smart Parking Management Software" {
            tags "SmartPark"
            //containers
            db = container "Database Schema" "MongoDB"{
                tags "Database"
            }
            wa = container "Web Application" "React JS"
            //components
            api = container "API Gateway" "SpringBoot"{
                resReq = component "Reservation Requests"
                transReq = component "Payment Requests"
                auth = component "User Authentication"
                mng = component "Account Management and Registration"
            }
            iot = container "IoT Server" "Azure"
            
            //components
            appServer = container "Application Server" "Azure"{
                res = component "Reservation Processing"
                trans = component "Transaction Processing"
                notif = component "Notification Service"
            }
        }
        
        //external systems
        iotSensor = softwareSystem "IoT Sensor" "Vehicle Detection System"{
            tags "External"
        }
        notificationGateway = softwareSystem "Notification Gateway" "SMS/Email reminders"{
            tags "External"
        }
        paymentGateways = softwareSystem "Payment Gateways"{
            tags "External"
        }
        regulatoryAuthorities = softwareSystem "Municipal Authorities" "Authorities for Parking Regulations"{
            tags "External"
        }
        
        //people
        customer -> smartPark "Uses"
        customer -> smartPark.wa "Visits"
        parkingStaff -> smartPark "Uses"
        parkingStaff -> smartPark.wa "Visits"
        
        //supporting software systems
        smartPark -> iotSensor "Uses to detect vehicles in parking spots"
        smartPark -> notificationGateway "Send parking spot availability notifications"
        smartPark -> paymentGateways "Sends parking payments "
        smartPark -> regulatoryAuthorities "Uses for parking compliance"
        
        //containers
        smartPark.wa -> smartPark.api "Communicates to"
        smartPark.api -> smartPark.appServer "Sends logic to compute"
        smartPark.wa -> smartPark.appServer "Sends authentication logic to"
        smartPark.appServer -> smartPark.db "Reads from and writes to"
        smartPark.appServer -> smartPark.iot "Reads IoT data"
        
        //appserver comp
        smartPark.wa -> smartPark.api.auth "Manages logins and authentication"
        smartPark.wa -> smartPark.api.mng "Provides way to manage account vehicle and payment settings"
        smartPark.wa -> smartPark.api.resReq "Recieves requests for Reservations"
        smartPark.wa -> smartPark.api.transReq "Recieves requests for Payments"
        smartPark.wa -> smartPark.appServer.trans "Handles fund transfers"
        smartPark.wa -> smartPark.appServer.notif "Manages notifcations and authentication"
        smartPark.wa -> smartPark.appServer.res "Creates Reservation"

        
    }

    views {
        systemContext smartPark "ContextDiagram" {
            include *
            autolayout lr
        }
        
        container smartPark "ContainerDiagram" {
            include *
            autolayout lr
        }
        
        component smartPark.appServer "ApplicationServerComponent" {
            include *
            autolayout lr
        }
        component smartPark.api "APIComponent" {
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
            element "SmartPark" {
                background #900C3F
                border solid
            }

        }
    }

    configuration {
        scope softwaresystem
    }

}
