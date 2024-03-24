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

public class CreditCardServlet extends HttpServlet {

  private final Gson gson = new Gson();
  private static final String DATA_FILE = "carddb.json";

  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    // Read all credit card data from the JSON file.


    List < CreditCard > creditCardsList = readCreditCardsList();

    // Parse JSON body of the request.
    JsonObject requestBody = parseJsonRequestBody(request);

    // Extract the transaction details from the request body.
    String senderCardNumber = requestBody.get("cardNumber").getAsString();
    double amountToTransfer = requestBody.get("amount").getAsDouble();
    String senderCvv = requestBody.get("cvv").getAsString();
    String senderName = requestBody.get("cardHolderName").getAsString();
    String expirationDate = requestBody.get("expirationDate").getAsString();
    String recipientCardNumber = requestBody.get("recipientCardNumber").getAsString();

    // Find the sender and recipient cards in the list
    CreditCard senderCard = findCardByNumber(creditCardsList, senderCardNumber);
    CreditCard recipientCard = findCardByNumber(creditCardsList, recipientCardNumber);

    // Prepare the JSON response object.
    JsonObject responseJson = new JsonObject();

    // Check the validity of both the sender's and recipient's cards.
    if (senderCard != null && recipientCard != null &&
      senderCard.getExpirationDate().equals(expirationDate) &&
      senderCard.getCvv().equals(senderCvv) &&
      senderCard.getCardHolderName().equals(senderName)) {

      // Check if the sender has enough balance for the transfer.
      if (senderCard.getBalance() >= amountToTransfer) {
        // Perform the transaction by updating the balances.
        senderCard.setBalance(senderCard.getBalance() - amountToTransfer);
        recipientCard.setBalance(recipientCard.getBalance() + amountToTransfer);

        // Write the updated list back to the file.
        writeCreditCardsList(creditCardsList);

        // Transaction is successful.
        responseJson.addProperty("status", "success");
        responseJson.addProperty("message", "Transfer completed successfully.");
        responseJson.addProperty("cardNumber", senderCardNumber);
        responseJson.addProperty("recipientCardNumber", recipientCardNumber);
        responseJson.addProperty("amount", amountToTransfer);

      } else {
        // Sender does not have enough balance.
        responseJson.addProperty("status", "error");
        responseJson.addProperty("message", "Insufficient balance.");
      }
    } else {
      // Card validation failed.
      responseJson.addProperty("status", "error");
      responseJson.addProperty("message", "Invalid card details.");
    }
    // Write the response back to the client.
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

  private void writeCreditCardsList(List < CreditCard > creditCardsList) throws IOException {
    try (FileWriter writer = new FileWriter(DATA_FILE)) {
      gson.toJson(creditCardsList, writer);
    } catch (IOException e) {
      throw new RuntimeException("Error writing file", e);
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

  // Assuming you have a credit card class
  // Update with getters and setters for new fields.
  class CreditCard {
    private int id;
    private String cardholder_name;
    private String card_number;
    private String expiration_date;
    private String cvv;
    private double balance;
    // Other methods and fields...

    // Constructors, getters, and setters
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
    // Ensure you add other necessary getters and setters...
  }
}