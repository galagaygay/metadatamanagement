package eu.dzhw.fdz.metadatamanagement.ordermanagement.domain;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import eu.dzhw.fdz.metadatamanagement.datasetmanagement.domain.DataSet;
import eu.dzhw.fdz.metadatamanagement.projectmanagement.domain.DataAcquisitionProject;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Product which can be ordered by a customer.
 * 
 * @author René Reitmann
 */
@NoArgsConstructor
@Data
@AllArgsConstructor
@Builder
public class Product {

  /**
   * The id of the {@link DataAcquisitionProject} in which this product was generated.
   * 
   * Must not be empty.
   */
  @NotEmpty
  private String dataAcquisitionProjectId;

  /**
   * The (partial) {@link Study} of this product.
   * 
   * Must not be empty.
   */
  @NotNull
  @Valid
  private Study study;

  /**
   * The access way to the {@link DataSet}s which the {@link Customer} wants to have.
   */
  @NotEmpty
  private String accessWay;

  /**
   * The version of the {@link DataSet}s which the {@link Customer} wants to have.
   */
  @NotEmpty
  private String version;
}
