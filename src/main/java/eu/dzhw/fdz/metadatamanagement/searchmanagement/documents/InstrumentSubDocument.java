package eu.dzhw.fdz.metadatamanagement.searchmanagement.documents;

import java.util.List;

import org.springframework.beans.BeanUtils;

import eu.dzhw.fdz.metadatamanagement.common.domain.AbstractRdcDomainObject;
import eu.dzhw.fdz.metadatamanagement.common.domain.I18nString;
import eu.dzhw.fdz.metadatamanagement.instrumentmanagement.domain.projections.InstrumentSubDocumentProjection;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Attributes of a instrument which are stored in other search documents.
 *  
 * @author René Reitmann
 */
@SuppressWarnings("CPD-START")
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Getter
@Setter
public class InstrumentSubDocument extends AbstractRdcDomainObject
    implements InstrumentSubDocumentProjection {
  private String id;
  
  private String dataAcquisitionProjectId;
  
  private I18nString title;
  
  private I18nString subtitle;
  
  private I18nString description;
  
  private Integer number;
  
  private String type;
  
  private List<String> surveyIds;

  private String studyId;

  public InstrumentSubDocument() {
    super();
  }

  /**
   * Create the subdocument.
   * 
   * @param projection The projection loaded from mongo.
   */
  public InstrumentSubDocument(InstrumentSubDocumentProjection projection) {
    super();
    BeanUtils.copyProperties(projection, this);
  }
}
