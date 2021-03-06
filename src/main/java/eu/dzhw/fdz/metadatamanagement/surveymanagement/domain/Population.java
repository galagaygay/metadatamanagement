package eu.dzhw.fdz.metadatamanagement.surveymanagement.domain;

import javax.validation.constraints.NotNull;

import org.javers.core.metamodel.annotation.ValueObject;

import eu.dzhw.fdz.metadatamanagement.common.domain.I18nString;
import eu.dzhw.fdz.metadatamanagement.common.domain.validation.I18nStringNotEmpty;
import eu.dzhw.fdz.metadatamanagement.common.domain.validation.I18nStringSize;
import eu.dzhw.fdz.metadatamanagement.common.domain.validation.StringLengths;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Details of the population of a {@link Survey}.
 */
@NoArgsConstructor
@Data
@AllArgsConstructor
@Builder
@ValueObject
public class Population {

  /**
   * A short title for the population.
   * 
   * It must be specified in at least one language and it must not contain more than 512 characters.
   */
  @NotNull(message = "survey-management.error.population.title.not-null")
  @I18nStringNotEmpty(message = "survey-management.error.population.title.i18n-string-not-empty")
  @I18nStringSize(max = StringLengths.MEDIUM,
      message = "survey-management.error.population.title.i18n-string-size")
  private I18nString title;

  /**
   * A description of the population.
   * 
   * It must be specified in at least one language and it must not contain more than 2048
   * characters.
   */
  @NotNull(message = "survey-management.error.population.description.not-null")
  @I18nStringNotEmpty(
      message = "survey-management.error.population.description.i18n-string-not-empty")
  @I18nStringSize(max = StringLengths.LARGE,
      message = "survey-management.error.population.description.i18n-string-size")
  private I18nString description;

}
