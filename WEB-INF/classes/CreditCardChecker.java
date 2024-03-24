import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;

public class CreditCardChecker extends HttpServlet {

  private final Gson gson = new Gson();
  private static final String DATA_FILE = "carddb.json";

  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    List<CreditCard> creditCardsList = readCreditCardsList();
    JsonObject requestBody = parseJsonRequestBody(request);
    
    String senderCardNumber = requestBody.get("cardNumber").getAsString();
    String senderCvv = requestBody.get("cvv").getAsString();
    String senderName = requestBody.get("cardHolderName").getAsString();
    String expirationDate = requestBody.get("expirationDate").getAsString();
  
    CreditCard senderCard = findCardByNumber(creditCardsList, senderCardNumber);
    JsonObject responseJson = new JsonObject();
  
    if (senderCard != null &&
      senderCard.getExpirationDate().equals(expirationDate) &&
      senderCard.getCvv().equals(senderCvv) &&
      senderCard.getCardHolderName().equals(senderName)) {
      
      // If validation is successful, include card details in the response
      responseJson.addProperty("status", "success");
      responseJson.addProperty("message", "Card details found.");
      responseJson.addProperty("id", senderCard.getId());
      responseJson.addProperty("cardHolderName", senderCard.getCardHolderName());
      responseJson.addProperty("cardNumber", senderCard.getCardNumber());
      responseJson.addProperty("expirationDate", senderCard.getExpirationDate());
      responseJson.addProperty("cvv", senderCard.getCvv());
      responseJson.addProperty("balance", senderCard.getBalance());
  
    } else {
      responseJson.addProperty("status", "error");
      responseJson.addProperty("message", "Invalid card details.");
    }
  
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    response.getWriter().write(gson.toJson(responseJson));
  }
  

  private List < CreditCard > readCreditCardsList() throws IOException {
    try (FileReader reader = new FileReader(DATA_FILE)) {
      return gson.fromJson(reader, new TypeToken < List < CreditCard >> () {}.getType());
    } catch (IOException e) {
      throw new RuntimeException("Error reading file", e);
    }
  }

  private JsonObject parseJsonRequestBody(HttpServletRequest request) throws IOException {
    StringBuilder buffer = new StringBuilder();
    try (BufferedReader reader = request.getReader()) {
      String line;
      while ((line = reader.readLine()) != null) {
        buffer.append(line);
      }
    }
    return gson.fromJson(buffer.toString(), JsonObject.class);
  }
  private CreditCard findCardByNumber(List < CreditCard > creditCardsList, String cardNumber) {
    return creditCardsList.stream()
      .filter(card -> card.getCardNumber().equals(cardNumber))
      .findFirst()
      .orElse(null);
  }

  class CreditCard {
    private int id;
    private String cardholder_name;
    private String card_number;
    private String expiration_date;
    private String cvv;
    private double balance;
    public int getId() {
      return id;
    }
    public String getCardHolderName() {
      return cardholder_name;
    }
    public String getCardNumber() {
      return card_number;
    }
    public String getExpirationDate() {
      return expiration_date;
    }
    public String getCvv() {
      return cvv;
    }
    public double getBalance() {
      return balance;
    }

    public void setId(int id) {
      this.id = id;
    }
    public void setCardholderName(String name) {
      this.cardholder_name = name;
    }
    public void setCardNumber(String number) {
      this.card_number = number;
    }
    public void setExpirationDate(String date) {
      this.expiration_date = date;
    }
    public void setCvv(String cvv) {
      this.cvv = cvv;
    }
    public void setBalance(double balance) {
      this.balance = balance;
    }
  }
}