/**
 * 
 */
package eu.dzhw.fdz.metadatamanagement.web.rest.util;

import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.junit.Assert.assertThat;

import java.net.URISyntaxException;

import org.junit.Test;

/**
 * @author Daniel Katzberg
 * 
 * No integration test. No need for application context. *
 */
public class HeaderUtilTest {
  
  @Test
  public void testHeaderUtilConstructor() throws URISyntaxException {
    // Arrange
    HeaderUtil headerUtil = new HeaderUtil();
    
    // Act

    // Assert
    assertThat(headerUtil, not(nullValue()));
  }
}
