#include <iostream>
#include <cpr/cpr.h>
#include "crow.h"
#include <mutex>
#include <pqxx/pqxx>
#include <pqxx/result> // i just added this 
using namespace std;
using namespace cpr;
using namespace crow;
#include <nlohmann/json.hpp>
using json = nlohmann::json;


//C++ Crow used for retrieving information 
//g++ -o backend backend.cpp -std=c++17 -pthread -lcpr -lsqlite3 -lpqxx -L/usr/local/opt/libpq/lib -I/usr/local/opt/libpq/include -lpq

int main(){

    crow::SimpleApp app;//Used to initialise CROW server  

    CROW_ROUTE(app, "/id").methods("GET"_method)([&](const crow::request& req) {

        //The idea is to communicate with Django server and the front end using APIs
        auto request = cpr::Get(Url{"http://127.0.0.1:9000/etms/users/"});// This is python server
        crow::response res(request.text);
        res.set_header("Access-Control-Allow-Origin", "http://localhost:3000"); 
        res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");

        return res; // store it globally
    });

    //Handle Sales report here
    //Connect to the postgre sql server db first
    //Then get the user data from python django server
    //Return the correct details associated with the user
    CROW_ROUTE(app, "/get_sales/").methods("GET"_method,"OPTIONS"_method)
    ([&](const crow::request& req) {

        crow::response res;
        res.set_header("Access-Control-Allow-Origin", "http://localhost:3000"); 
        res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        cout<<"Here"<<endl;

        if (req.method == "OPTIONS"_method) {
            res.code = 200;
            return res;
        }
        
        pqxx::connection conn("host=db port=5432 dbname=etms user=mario password=mariopassword");
        if (!conn.is_open()) {
            return crow::response(500, "Can't open database");
        }

        try {
            pqxx::nontransaction ntx{conn}; // It should be a user_id, add that  to sale model
            auto result = ntx.exec("SELECT * FROM etms_app_sale;");
           
            nlohmann::json json_array = nlohmann::json::array();

            for (auto row = result.begin(); row != result.end(); ++row) {
                nlohmann::json item;
                item["id"] = row["id"].c_str();
                item["sales"] = row["sales"].as<double>();
                item["eventId"] = row["event_id"].c_str();
                item["organizerId"] = row["organizer"].c_str();
                json_array.push_back(item);
            }

            //return crow::response{json_array.dump()};
            res.code = 200;
            res.body = json_array.dump();
            return res;
        }
        catch (const std::exception& e) { 
            return crow::response(500, std::string("Internal server error: ") + e.what());
        } 
       
    });

    CROW_ROUTE(app, "/record_sales").methods("PUT"_method, "OPTIONS"_method)([](const crow::request& req){
         auto add_cors = [](crow::response& res) {
            res.add_header("Access-Control-Allow-Origin", "http://localhost:3000");
            res.add_header("Access-Control-Allow-Methods", "POST, OPTIONS ,PUT");
            res.add_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        };
        crow::response res;
        if (req.method == "OPTIONS"_method) {
            add_cors(res);
            res.code = 200;
            return res;
        }

        try {
            auto body = crow::json::load(req.body);
            add_cors(res);
            if (!body) {
                res.code = 400;
                res.body = "Invalid JSON";
                add_cors(res);
                return res;
            }
            cout<<body<<endl;

            //Extract the required data from the frontend
            if (!body.has("eventId") || !body.has("price") || !body.has("participants")) {
                return crow::response(400, "Missing required fields");
            }

            int eventId = body["eventId"].i();
            int price = body["price"].i();  // decimal in models.py
            int participants = body["participants"].i();

            std::cout << "Received eventId: " << eventId << std::endl;
            std::cout << "Received price: " << price << std::endl;
            std::cout << "Received participants: " << participants << std::endl;

            // Connect to PostgreSQL
            pqxx::connection conn("host=localhost port=5432 dbname=etms user=mario password=mariopassword");
            if (!conn.is_open()) {
                return crow::response(500, "Failed to connect to database");
            }
            std::cout << "Connected to DB" << std::endl;

            // Placeholder: insert/update logic here
            // pqxx::work txn{conn};
            // std::string query = "UPDATE etms_app_sale SET sales = " + std::to_string(price * participants) +
            //     ", quantity = " + std::to_string(participants) +
            //     " WHERE event_id = " + std::to_string(eventId) + ";";
            // txn.exec(query);
            // txn.commit();

            res.code = 200;
            res.body = "Request processed";
            add_cors(res);
            return res;

        } catch (const std::exception& e) {
            return crow::response(500, std::string("Server error: ") + e.what());
        }
    });


    cout<<"C++ backend set up completed";
    app.port(9999).multithreaded().run();
    return 0;
}