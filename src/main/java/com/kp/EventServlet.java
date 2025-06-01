package com.kp;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.dbcp2.BasicDataSource;

import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@WebServlet("/event")
public class EventServlet extends HttpServlet {
     
     private BasicDataSource datasource;
     
     @Override
     public void init() throws ServletException {
          datasource = new BasicDataSource();
          datasource.setDriverClassName("com.mysql.jdbc.Driver");
          datasource.setUrl("jdbc:mysql://localhost:3306/eventdb");
          datasource.setUsername("root");
          datasource.setPassword("Ijse@1234");
          datasource.setInitialSize(5);
          datasource.setMaxTotal(5);
     }
     
     
     @Override
     protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
          
          try {
               Class.forName("com.mysql.cj.jdbc.Driver");
               Connection connection = datasource.getConnection();
               ResultSet resultSet = connection
                    .prepareStatement("select * from event").executeQuery();
               List<Map<String, String>> elist = new ArrayList<>();
               while (resultSet.next()) {
                    
                    Map<String, String> event = new HashMap<String, String>();
                    event.put("eid", resultSet.getString("eid"));
                    event.put("ename", resultSet.getString("ename"));
                    event.put("edescription", resultSet.getString("edescription"));
                    event.put("edate", resultSet.getString("edate"));
                    event.put("eplace", resultSet.getString("eplace"));
                    elist.add(event);
               }
               resp.setContentType("application/json");
               ObjectMapper mapper = new ObjectMapper();
               mapper.writeValue(resp.getWriter(), elist);
               
               
          } catch (ClassNotFoundException e) {
               throw new RuntimeException(e);
          } catch (SQLException e) {
               throw new RuntimeException(e);
          }
     }
     
     @Override
     protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
          
          ObjectMapper mapper = new ObjectMapper();
          Map<String, String> event = mapper.readValue(req.getInputStream(), Map.class);
          
          try {
               Class.forName("com.mysql.cj.jdbc.Driver");
               Connection connection = datasource.getConnection();
               
               PreparedStatement stmt = connection.prepareStatement(
                    "INSERT INTO event (eid,ename, edescription, edate, eplace) VALUES (?, ?, ?, ?,?)"
               );
               stmt.setString(1, event.get("eid"));
               stmt.setString(2, event.get("ename"));
               stmt.setString(3, event.get("edescription"));
               stmt.setString(4, event.get("edate"));
               stmt.setString(5, event.get("eplace"));
               
               int rows = stmt.executeUpdate();
               resp.setContentType("application/json");
               mapper.writeValue(resp.getWriter(), rows);
               
          } catch (Exception e) {
               throw new RuntimeException(e);
          }
     }
     
     @Override
     protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
          
          ObjectMapper mapper = new ObjectMapper();
          Map<String, String> event = mapper.readValue(req.getInputStream(), Map.class);
          
          try {
               Class.forName("com.mysql.cj.jdbc.Driver");
               Connection connection = datasource.getConnection();
               
               PreparedStatement stmt = connection.prepareStatement(
                    "UPDATE event SET ename = ?, edescription = ?, edate = ?, eplace = ? WHERE eid = ?"
               );
               stmt.setString(1, event.get("ename"));
               stmt.setString(2, event.get("edescription"));
               stmt.setString(3, event.get("edate"));
               stmt.setString(4, event.get("eplace"));
               stmt.setString(5, event.get("eid"));
               
               int rows = stmt.executeUpdate();
               resp.setContentType("application/json");
               mapper.writeValue(resp.getWriter(), rows);
               
          } catch (Exception e) {
               throw new RuntimeException(e);
          }
     }
     
     
     @Override
     protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        /*ObjectMapper mapper = new ObjectMapper();
        Map<String, String> body = mapper.readValue(req.getInputStream(), Map.class);
        String eid = body.get("eid");*/
          String eid = req.getParameter("eid");
          
          try {
               Class.forName("com.mysql.cj.jdbc.Driver");
               Connection connection = datasource.getConnection();
               
               PreparedStatement stmt = connection.prepareStatement("DELETE FROM event WHERE eid = ?");
               stmt.setString(1, eid);
               
               int rows = stmt.executeUpdate();
               resp.setContentType("application/json");
               //mapper.writeValue(resp.getWriter(), rows);
               resp.getWriter().write("success");
               
          } catch (Exception e) {
               throw new RuntimeException(e);
          }
     }
}